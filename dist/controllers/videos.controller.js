"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = exports.getMyVideos = exports.getVideos = exports.createVideo = void 0;
const express_validator_1 = require("express-validator");
const video_model_1 = __importDefault(require("../models/video.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const createVideo = async (req, res) => {
    try {
        const { videoId, source, category, userId, date, metadata } = (0, express_validator_1.matchedData)(req);
        // Check if the category ID exists in the Category collection
        const existingCategory = await category_model_1.default.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }
        // Check if the userId exists in the User collection
        // const existingUser = await User.findById(userId);
        // if (!existingUser) {
        //     return res.status(404).json({ error: true, message: "User not found", data: null });
        // }
        //
        const newVideo = new video_model_1.default({ videoId, source, category, userId, date, metadata });
        const video = await newVideo.save();
        return res.status(201).json({ message: "Video created successfully", data: video });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error creating video", data: null });
    }
};
exports.createVideo = createVideo;
const getVideos = async (req, res) => {
    try {
        console.log(req.headers);
        const videos = await video_model_1.default.find();
        return res.status(200).json({ message: "Videos retrieved successfully", data: videos });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving videos", data: null });
    }
};
exports.getVideos = getVideos;
const getMyVideos = async (req, res) => {
    try {
        const { userId } = req.params;
        const videos = await video_model_1.default.find({ userId });
        return res.status(200).json({ message: "User's videos retrieved successfully", data: videos });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving user's videos", data: null });
    }
};
exports.getMyVideos = getMyVideos;
const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;
        // Validate the query parameter
        if (!query) {
            return res.status(400).json({ error: true, message: "Query parameter is required", data: null });
        }
        // Perform the search in MongoDB
        const videos = await video_model_1.default.find({
            $or: [
                { 'metadata.author_name': new RegExp(query, 'i') },
                { 'metadata.title': new RegExp(query, 'i') },
                { 'category': await getCategoryIdsByTitle(query) } // Search by category title
            ]
        });
        // Check if any videos were found
        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: true, message: "No videos found for the query", data: null });
        }
        // Return successful response
        return res.status(200).json({ message: "Videos found successfully", data: videos });
    }
    catch (error) {
        // Log detailed error
        logger_1.default.error(error);
        // Return error response
        return res.status(500).json({ error: true, message: error.message || "Error searching videos", data: null });
    }
};
exports.searchVideos = searchVideos;
//
/**
 * Helper function to retrieve category IDs based on category title.
 * This function assumes category titles are unique.
 */
const getCategoryIdsByTitle = async (title) => {
    const categories = await category_model_1.default.find({ 'title': new RegExp(title, 'i') }, '_id');
    return categories.map(category => category._id.toString());
};
//# sourceMappingURL=videos.controller.js.map