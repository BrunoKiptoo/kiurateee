import express from "express";
import { validateApiKey } from "../config/api-key.config";
import { validate } from "../middlewares/validate-request";
import { addCategoryValidator } from "../middlewares/validators/category.validators";
import { addCategory, getAllCategories, selectCategoriesAsUser } from "../controllers/category.controller";

const router = express.Router();

router.post("/add-category", validateApiKey, addCategoryValidator, validate, addCategory);
router.get("/all", validateApiKey, getAllCategories);
router.post("/select-categories", validateApiKey, selectCategoriesAsUser);

export default router;
