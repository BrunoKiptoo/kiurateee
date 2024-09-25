"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategory = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const admin_1 = __importDefault(require("../models/admin"));
const addCategory = async (req, res) => {
    const { title, description, cover_image } = req.body;
    try {
        // Create a new category
        const newCategory = new admin_1.default({
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
//# sourceMappingURL=admin.controller.js.map