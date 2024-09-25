"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVideos = exports.createVideo = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const video_model_1 = __importDefault(require("../models/video.model"));
const category_model_1 = __importDefault(require("../models/category.model")); // Import the category model
const createVideo = async (req, res) => {
    const { videoId, source, category, date, videodata } = req.body;
    try {
        // Check if the category exists
        const categoryExists = await category_model_1.default.findById(category);
        if (!categoryExists) {
            logger_1.default.info(`Category not found for ID: ${category}`);
            return res.status(404).json({ msg: "Category not found" });
        }
        // Create a new video
        const newVideo = new video_model_1.default({
            videoId,
            source,
            category,
            date,
            videodata,
        });
        // Save the video to the database
        await newVideo.save();
        // Optionally, you can also update the category to add this video to its videos array
        await category_model_1.default.findByIdAndUpdate(category, {
            $push: { videos: newVideo._id },
        });
        logger_1.default.info(`Video added with ID: ${videoId}`);
        res.status(201).json({ msg: "Video added successfully", video: newVideo });
    }
    catch (err) {
        logger_1.default.error(`Error adding video: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.createVideo = createVideo;
const getAllVideos = async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    // Apply search filters
    if (search) {
        const searchTerm = search.trim().toLowerCase();
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
        const total = await video_model_1.default.countDocuments(query).populate("category");
        // Get the paginated results
        const videos = await video_model_1.default.find(query)
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
    }
    catch (err) {
        logger_1.default.error(`Server error on fetching videos: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.getAllVideos = getAllVideos;
//# sourceMappingURL=videos.controller.js.map