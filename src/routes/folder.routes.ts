// src/routes/folder.routes.ts
import express from "express";
import { validateApiKey } from "../config/api-key.config";
import { addFolderValidator, updateFolderValidator } from "../middlewares/validators/folder.validators";
import { validate } from "../middlewares/validate-request";
import { addFolder, deleteFolder, getAllFolders, updateFolder } from "../controllers/folder.controller";
import { coverImageUpload } from "../shared/uploads/fileUploads";

const router = express.Router();

router.post("/new", validateApiKey, coverImageUpload, addFolderValidator, validate, addFolder);
router.post("/update/:folderId", validateApiKey, coverImageUpload, updateFolderValidator, validate, updateFolder);
router.get("/all", validateApiKey, getAllFolders);
router.delete("/delete/:folderId", validateApiKey, deleteFolder);
export default router;
