import { Request, Response } from "express";
import Logger from "../utils/logger";
import categoryModel from "../models/category.model";
import { IMetadata } from "../interface/interfaces";
import Category from "../models/category.model";
import User from "../models/user.model";

const addCategory = async (req: Request, res: Response) => {
  const { title, description, cover_image } = req.body;

  try {
    // Check if a category with the same title already exists
    const existingCategory = await categoryModel.findOne({ title });
    if (existingCategory) {
      Logger.info(`Category already exists: ${title}`);
      return res.status(400).json({ msg: "Category already exists" });
    }

    // Create a new category
    const newCategory = new categoryModel({
      title,
      description,
      cover_image,
    });

    // Save the category to the database
    await newCategory.save();

    Logger.info(`Category added: ${title}`);
    res.status(201).json({ msg: "Category added successfully", category: newCategory });
  } catch (err) {
    Logger.error(`Error adding category: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, title } = req.query;

  const query: any = {};

  if (title) {
    query.title = new RegExp(title as string, "i");
  }

  try {
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("videos"); // Populate videos field

    const metadata: IMetadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    res.json({ categories, metadata });
  } catch (err) {
    Logger.error(`Server error on fetching categories: ${err.message}`);
    res.status(500).send("Server error");
  }
};

const selectCategoriesAsUser = async (req: Request, res: Response) => {
  const { userId, categories } = req.body;

  try {
    // Validate user existence
    const user = await User.findById(userId).populate({
      path: "selectedCategories",
      populate: {
        path: "videos", // This will populate videos for each category
        model: "Video", // Model name for the video
      },
    });

    if (!user) {
      Logger.info(`User not found for ID: ${userId}`);
      return res.status(404).json({ msg: "User not found" });
    }

    // Validate category existence
    const existingCategories = await Category.find({ _id: { $in: categories } });
    if (existingCategories.length !== categories.length) {
      Logger.info(`One or more categories not found`);
      return res.status(404).json({ msg: "One or more categories not found" });
    }

    // Update user's selected categories
    user.selectedCategories = categories;
    await user.save();

    // Populate categories with videos
    const populatedCategories = await Category.find({ _id: { $in: categories } }).populate({
      path: "videos",
      model: "Video",
    });

    Logger.info(`Categories updated for user ID: ${userId}`);
    res.status(200).json({
      msg: "Categories updated successfully",
      user: {
        ...user.toObject(),
        selectedCategories: populatedCategories,
      },
    });
  } catch (err) {
    Logger.error(`Error updating categories: ${err.message}`);
    res.status(500).send("Server error");
  }
};

export { addCategory, getAllCategories, selectCategoriesAsUser };
