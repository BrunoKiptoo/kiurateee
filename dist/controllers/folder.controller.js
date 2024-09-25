"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.getAllFolders = exports.updateFolder = exports.addFolder = void 0;
const express_validator_1 = require("express-validator");
const folder_model_1 = __importDefault(require("../models/folder.model"));
const addFolder = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { link, category, title, description, user_id } = req.body;
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        const coverImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
        if (!coverImage) {
            return res.status(400).json({ message: "Cover image is required" });
        }
        // Assuming folderModel is defined and has a schema to accept these fields
        const newFolder = new folder_model_1.default({
            link,
            category,
            cover_image: coverImage,
            title,
            description,
            user_id,
        });
        await newFolder.save();
        res.status(201).json({ message: "Folder created successfully", folder: newFolder });
    }
    catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.addFolder = addFolder;
const updateFolder = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { folderId } = req.params; // Assuming folderId is passed in the URL
        const { link, category, title, description, user_id } = req.body;
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        const coverImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
        if (!coverImage) {
            return res.status(400).json({ message: "Cover image is required" });
        }
        const folder = await folder_model_1.default.findById(folderId);
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
    }
    catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.updateFolder = updateFolder;
const getAllFolders = async (req, res) => {
    const { page = 1, limit = 10, title, category } = req.query;
    const query = {};
    if (title) {
        query.title = new RegExp(title, "i");
    }
    if (category) {
        query.category = category;
    }
    try {
        const total = await folder_model_1.default.countDocuments(query);
        const folders = await folder_model_1.default
            .find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate("user") // Populate user field if needed
            .exec(); // Ensure to execute the query
        const metadata = {
            total,
            current_page: Number(page),
            has_next_page: Number(page) * Number(limit) < total,
            has_previous_page: Number(page) > 1,
            next_page: Number(page) * Number(limit) < total ? Number(page) + 1 : null,
            previous_page: Number(page) > 1 ? Number(page) - 1 : null,
            last_page: Math.ceil(total / Number(limit)),
        };
        res.json({ folders, metadata });
    }
    catch (err) {
        console.error(`Server error on fetching folders: ${err.message}`);
        res.status(500).send("Server error");
    }
};
exports.getAllFolders = getAllFolders;
const deleteFolder = async (req, res) => {
    const { folderId } = req.params; // Folder ID should be provided in the URL
    try {
        // Find and delete the folder by its ID
        const folder = await folder_model_1.default.findByIdAndDelete(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.status(200).json({ message: "Folder deleted successfully", folder });
    }
    catch (error) {
        console.error(`Server error on deleting folder: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};
exports.deleteFolder = deleteFolder;
//# sourceMappingURL=folder.controller.js.map