import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import Video from '../models/video.model';
import Category from '../models/category.model';
import Logger from '../utils/logger';

const createVideo = async (req: Request, res: Response) => {
    try {
        const { videoId, source, category, userId, date, metadata } = matchedData(req);

        // Check if the category ID exists in the Category collection
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }

        // Check if the userId exists in the User collection
        // const existingUser = await User.findById(userId);
        // if (!existingUser) {
        //     return res.status(404).json({ error: true, message: "User not found", data: null });
        // }
        //

        const newVideo = new Video({ videoId, source, category, userId, date, metadata });
        const video = await newVideo.save();
        return res.status(201).json({ message: "Video created successfully", data: video });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error creating video", data: null });
    }
};

const getVideos = async ( req: Request, res: Response) => {
    try {
        console.log(req.headers);
        const videos = await Video.find();
        return res.status(200).json({ message: "Videos retrieved successfully", data: videos });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving videos", data: null });
    }
};

const getMyVideos = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const videos = await Video.find({ userId });
        return res.status(200).json({ message: "User's videos retrieved successfully", data: videos });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving user's videos", data: null });
    }
};

const searchVideos = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        // Validate the query parameter
        if (!query) {
            return res.status(400).json({ error: true, message: "Query parameter is required", data: null });
        }

        // Perform the search in MongoDB
        const videos = await Video.find({
            $or: [
                { 'metadata.author_name': new RegExp(query as string, 'i') },
                { 'metadata.title': new RegExp(query as string, 'i') },
                { 'category': await getCategoryIdsByTitle(query as string) } // Search by category title
            ]
        });

        // Check if any videos were found
        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: true, message: "No videos found for the query", data: null });
        }

        // Return successful response
        return res.status(200).json({ message: "Videos found successfully", data: videos });
    } catch (error) {
        // Log detailed error
        Logger.error(error);
        // Return error response
        return res.status(500).json({ error: true, message: error.message || "Error searching videos", data: null });
    }
};

//
/**
 * Helper function to retrieve category IDs based on category title.
 * This function assumes category titles are unique.
 */
const getCategoryIdsByTitle = async (title: string): Promise<string[]> => {
    const categories = await Category.find({ 'title': new RegExp(title, 'i') }, '_id');
  
    return categories.map(category => (category as any)._id.toString());
  };
  

export { createVideo, getVideos, getMyVideos, searchVideos };
