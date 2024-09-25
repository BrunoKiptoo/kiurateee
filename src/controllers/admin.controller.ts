import { Request, Response } from "express";
import Logger from "../utils/logger";
import admin from "../models/admin";

const addCategory = async (req: Request, res: Response) => {
  const { title, description, cover_image } = req.body;

  try {
    // Create a new category
    const newCategory = new admin({
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

export { addCategory };
