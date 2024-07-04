"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllCategories = exports.deleteCategory = exports.getCategory = exports.getCategories = exports.createCategory = void 0;
const express_validator_1 = require("express-validator");
const category_model_1 = __importDefault(require("../models/category.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const createCategory = async (req, res) => {
    try {
        const { title, description, coverImage, userId } = (0, express_validator_1.matchedData)(req);
        // Check if a category with the same title already exists
        const existingCategory = await category_model_1.default.findOne({ title });
        if (existingCategory) {
            return res.status(400).json({ error: true, message: "Category with this title already exists", data: null });
        }
        const newCategory = new category_model_1.default({ title, description, coverImage, userId });
        const category = await newCategory.save();
        return res.status(201).json({ message: "Category created successfully", data: category });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error creating category", data: null });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        console.log(req.headers);
        const categories = await category_model_1.default.find();
        return res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving categories", data: null });
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.default.findById(id);
        if (!category) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }
        return res.status(200).json({ message: "Category retrieved successfully", data: category });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving category", data: null });
    }
};
exports.getCategory = getCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.default.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }
        return res.status(200).json({ message: "Category deleted successfully", data: category });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error deleting category", data: null });
    }
};
exports.deleteCategory = deleteCategory;
const deleteAllCategories = async (req, res) => {
    try {
        console.log(req.headers);
        await category_model_1.default.deleteMany();
        return res.status(200).json({ message: "All categories deleted successfully", data: null });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error deleting categories", data: null });
    }
};
exports.deleteAllCategories = deleteAllCategories;
//# sourceMappingURL=category.controller.js.map