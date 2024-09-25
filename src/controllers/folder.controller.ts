import { Request, Response } from "express";
import { validationResult } from "express-validator";
import folderModel from "../models/folder.model";
import { IMetadata } from "src/interface/interfaces";

// Extend the Request interface to include the file with Multer's File type
interface RequestWithFile extends Request {
  file?: Express.Multer.File & { location?: string }; // Include 'location' property
}

export const addFolder = async (req: RequestWithFile, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { link, category, title, description, user_id } = req.body;
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const coverImage = req.file?.location;

    if (!coverImage) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    // Assuming folderModel is defined and has a schema to accept these fields
    const newFolder = new folderModel({
      link,
      category,
      cover_image: coverImage,
      title,
      description,
      user_id,
    });

    await newFolder.save();

    res.status(201).json({ message: "Folder created successfully", folder: newFolder });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};

// Extend the Request interface to include the file with Multer's File type
interface RequestWithFile extends Request {
  file?: Express.Multer.File & { location?: string }; // Include 'location' property if applicable
}

export const updateFolder = async (req: RequestWithFile, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { folderId } = req.params; // Assuming folderId is passed in the URL
    const { link, category, title, description, user_id } = req.body;
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const coverImage = req.file?.location;

    if (!coverImage) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const folder = await folderModel.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    folder.link = link || folder.link;
    folder.category = category || folder.category;
    folder.cover_image = coverImage; // Ensure this is set if file is uploaded
    folder.title = title || folder.title;
    folder.description = description || folder.description;
    folder.user_id = user_id || folder.user_id;

    await folder.save();

    res.status(200).json({ message: "Folder updated successfully", folder });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};

export const getAllFolders = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, title, category } = req.query;

  const query: any = {};

  if (title) {
    query.title = new RegExp(title as string, "i");
  }

  if (category) {
    query.category = category;
  }

  try {
    const total = await folderModel.countDocuments(query);
    const folders = await folderModel
      .find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("user") // Populate user field if needed
      .exec(); // Ensure to execute the query

    const metadata: IMetadata = {
      total,
      current_page: Number(page),
      has_next_page: Number(page) * Number(limit) < total,
      has_previous_page: Number(page) > 1,
      next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
      previous_page: Number(page) > 1 ? Number(page) - 1 : null,
      last_page: Math.ceil(total / Number(limit)),
    };

    res.json({ folders, metadata });
  } catch (err) {
    console.error(`Server error on fetching folders: ${err.message}`);
    res.status(500).send("Server error");
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const { folderId } = req.params; // Folder ID should be provided in the URL

  try {
    // Find and delete the folder by its ID
    const folder = await folderModel.findByIdAndDelete(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json({ message: "Folder deleted successfully", folder });
  } catch (error) {
    console.error(`Server error on deleting folder: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
};
