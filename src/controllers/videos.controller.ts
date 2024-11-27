import { Request, Response } from "express";
import Logger from "../utils/logger";
import Video from "../models/video.model";
import Category from "../models/category.model"; // Import the category model
import User from "../models/user.model";

const createVideo = async (req: Request, res: Response) => {
  const { videoId, source, category, date, videodata, userId } = req.body;

  try {
    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      Logger.info(`User not found for ID: ${userId}`);
      return res.status(404).json({ msg: "User not found" });
    }

    // Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      Logger.info(`Category not found for ID: ${category}`);
      return res.status(404).json({ msg: "Category not found" });
    }

    // Create a new video associated with the user
    const newVideo = new Video({
      videoId,
      source,
      category,
      date,
      videodata,
      user: userId, 
    });

    // Save the video to the database
    await newVideo.save();

    // Optionally, update the category to add this video to its videos array
    await Category.findByIdAndUpdate(category, {
      $push: { videos: newVideo._id },
    });

    Logger.info(`Video added with ID: ${videoId} by user: ${userId}`);
    res.status(201).json({ msg: "Video added successfully", video: newVideo });
  } catch (err) {
    Logger.error(`Error adding video: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, userId, tag } = req.query;

  const query: any = {};

  // Apply user filters: Either by userId or tag
  if (userId) {
    query.user = userId;
  } else if (tag) {
    const user = await User.findOne({ tag });
    if (user) {
      query.user = user._id;
    } else {
      return res.status(404).json({ msg: "User with the provided tag not found" });
    }
  }

  // Apply search filters
  if (search) {
    const searchTerm = (search as string).trim().toLowerCase();
    query.$or = [
      { "videodata.title": new RegExp(searchTerm, "i") },
      { "videodata.author_name": new RegExp(searchTerm, "i") },
      {
        "category.title": new RegExp(searchTerm, "i"),
      },
    ];
  }

  try {
    // Get total count of matching videos
    const total = await Video.countDocuments(query).populate("category");

    // Get the paginated results
    const videos = await Video.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("category");

    // Metadata for pagination
    const metadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    res.json({ videos, metadata });
  } catch (err) {
    Logger.error(`Server error on fetching videos: ${err.message}`);
    res.status(500).send("Server error");
  }
};

export { createVideo, getAllVideos };
