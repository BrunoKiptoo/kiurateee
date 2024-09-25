"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCategoriesAsUser = exports.getAllCategories = exports.addCategory = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const category_model_1 = __importDefault(require("../models/category.model"));
const category_model_2 = __importDefault(require("../models/category.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const addCategory = async (req, res) => {
    const { title, description, cover_image } = req.body;
    try {
        // Check if a category with the same title already exists
        const existingCategory = await category_model_1.default.findOne({ title });
        if (existingCategory) {
            logger_1.default.info(`Category already exists: ${title}`);
            return res.status(400).json({ msg: "Category already exists" });
        }
        // Create a new category
        const newCategory = new category_model_1.default({
            title,
            description,
            cover_image,
        });
        // Save the category to the database
        await newCategory.save();
        logger_1.default.info(`Category added: ${title}`);
        res.status(201).json({ msg: "Category added successfully", category: newCategory });
    }
    catch (err) {
        logger_1.default.error(`Error adding category: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.addCategory = addCategory;
const getAllCategories = async (req, res) => {
    const { page = 1, limit = 10, title } = req.query;
    const query = {};
    if (title) {
        query.title = new RegExp(title, "i");
    }
    try {
        const total = await category_model_2.default.countDocuments(query);
        const categories = await category_model_2.default.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate("videos"); // Populate videos field
        const metadata = {
            total,
            current_page: Number(page),
            has_next_page: Number(page) * Number(limit) < total,
            has_previous_page: Number(page) > 1,
            next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
            previous_page: Number(page) > 1 ? Number(page) - 1 : null,
            last_page: Math.ceil(total / Number(limit)),
        };
        res.json({ categories, metadata });
    }
    catch (err) {
        logger_1.default.error(`Server error on fetching categories: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.getAllCategories = getAllCategories;
const selectCategoriesAsUser = async (req, res) => {
    const { userId, categories } = req.body;
    try {
        // Validate user existence
        const user = await user_model_1.default.findById(userId).populate({
            path: "selectedCategories",
            populate: {
                path: "videos", // This will populate videos for each category
                model: "Video", // Model name for the video
            },
        });
        if (!user) {
            logger_1.default.info(`User not found for ID: ${userId}`);
            return res.status(404).json({ msg: "User not found" });
        }
        // Validate category existence
        const existingCategories = await category_model_2.default.find({ _id: { $in: categories } });
        if (existingCategories.length !== categories.length) {
            logger_1.default.info(`One or more categories not found`);
            return res.status(404).json({ msg: "One or more categories not found" });
        }
        // Update user's selected categories
        user.selectedCategories = categories;
        await user.save();
        // Populate categories with videos
        const populatedCategories = await category_model_2.default.find({ _id: { $in: categories } }).populate({
            path: "videos",
            model: "Video",
        });
        logger_1.default.info(`Categories updated for user ID: ${userId}`);
        res.status(200).json({
            msg: "Categories updated successfully",
            user: Object.assign(Object.assign({}, user.toObject()), { selectedCategories: populatedCategories }),
        });
    }
    catch (err) {
        logger_1.default.error(`Error updating categories: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.selectCategoriesAsUser = selectCategoriesAsUser;
//# sourceMappingURL=category.controller.js.map