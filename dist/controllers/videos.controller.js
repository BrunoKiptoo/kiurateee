"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVideos = exports.createVideo = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const video_model_1 = __importDefault(require("../models/video.model"));
const category_model_1 = __importDefault(require("../models/category.model")); // Import the category model
const user_model_1 = __importDefault(require("../models/user.model"));
const createVideo = async (req, res) => {
    const { videoId, source, category, date, videodata, userId } = req.body;
    try {
        // Validate user existence
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            logger_1.default.info(`User not found for ID: ${userId}`);
            return res.status(404).json({ msg: "User not found" });
        }
        // Validate category existence
        const categoryExists = await category_model_1.default.findById(category);
        if (!categoryExists) {
            logger_1.default.info(`Category not found for ID: ${category}`);
            return res.status(404).json({ msg: "Category not found" });
        }
        // Create a new video associated with the user
        const newVideo = new video_model_1.default({
            videoId,
            source,
            category,
            date,
            videodata,
            user: userId, // Associate the video with the userId from req.body
        });
        // Save the video to the database
        await newVideo.save();
        // Optionally, update the category to add this video to its videos array
        await category_model_1.default.findByIdAndUpdate(category, {
            $push: { videos: newVideo._id },
        });
        logger_1.default.info(`Video added with ID: ${videoId} by user: ${userId}`);
        res.status(201).json({ msg: "Video added successfully", video: newVideo });
    }
    catch (err) {
        logger_1.default.error(`Error adding video: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.createVideo = createVideo;
const getAllVideos = async (req, res) => {
    const { page = 1, limit = 10, search, userId, tag } = req.query;
    const query = {};
    // Apply user filters: Either by userId or tag
    if (userId) {
        query.user = userId;
    }
    else if (tag) {
        const user = await user_model_1.default.findOne({ tag });
        if (user) {
            query.user = user._id;
        }
        else {
            return res.status(404).json({ msg: "User with the provided tag not found" });
        }
    }
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