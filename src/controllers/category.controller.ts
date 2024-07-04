import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import Category from '../models/category.model';
import Logger from '../utils/logger';

const createCategory = async (req: Request, res: Response) => {
    try {
        const { title, description, coverImage, userId } = matchedData(req);

        // Check if a category with the same title already exists
        const existingCategory = await Category.findOne({ title });
        if (existingCategory) {
            return res.status(400).json({ error: true, message: "Category with this title already exists", data: null });
        }

        const newCategory = new Category({ title, description, coverImage, userId });
        const category = await newCategory.save();
        return res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error creating category", data: null });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        console.log(req.headers);
        const categories = await Category.find();
        return res.status(200).json({ message: "Categories retrieved successfully", data: categories });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving categories", data: null });
    }
};

const getCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }
        return res.status(200).json({ message: "Category retrieved successfully", data: category });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error retrieving category", data: null });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: true, message: "Category not found", data: null });
        }
        return res.status(200).json({ message: "Category deleted successfully", data: category });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error deleting category", data: null });
    }
};

const deleteAllCategories = async (req: Request, res: Response) => {
    try {
        console.log(req.headers);
        await Category.deleteMany();
        return res.status(200).json({ message: "All categories deleted successfully", data: null });
    } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: true, message: error.message || "Error deleting categories", data: null });
    }
};

export { createCategory, getCategories, getCategory, deleteCategory, deleteAllCategories };
