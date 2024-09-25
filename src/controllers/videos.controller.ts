import { Request, Response } from "express";
import Logger from "../utils/logger";
import Video from "../models/video.model";
import Category from "../models/category.model"; // Import the category model

const createVideo = async (req: Request, res: Response) => {
  const { videoId, source, category, date, videodata } = req.body;

  try {
    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      Logger.info(`Category not found for ID: ${category}`);
      return res.status(404).json({ msg: "Category not found" });
    }

    // Create a new video
    const newVideo = new Video({
      videoId,
      source,
      category,
      date,
      videodata,
    });

    // Save the video to the database
    await newVideo.save();

    // Optionally, you can also update the category to add this video to its videos array
    await Category.findByIdAndUpdate(category, {
      $push: { videos: newVideo._id },
    });

    Logger.info(`Video added with ID: ${videoId}`);
    res.status(201).json({ msg: "Video added successfully", video: newVideo });
  } catch (err) {
    Logger.error(`Error adding video: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;

  const query: any = {};

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
