"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/folder.routes.ts
const express_1 = __importDefault(require("express"));
const api_key_config_1 = require("../config/api-key.config");
const folder_validators_1 = require("../middlewares/validators/folder.validators");
const validate_request_1 = require("../middlewares/validate-request");
const folder_controller_1 = require("../controllers/folder.controller");
const fileUploads_1 = require("../shared/uploads/fileUploads");
const router = express_1.default.Router();
router.post("/new", api_key_config_1.validateApiKey, fileUploads_1.coverImageUpload, folder_validators_1.addFolderValidator, validate_request_1.validate, folder_controller_1.addFolder);
router.post("/update/:folderId", api_key_config_1.validateApiKey, fileUploads_1.coverImageUpload, folder_validators_1.updateFolderValidator, validate_request_1.validate, folder_controller_1.updateFolder);
router.get("/all", api_key_config_1.validateApiKey, folder_controller_1.getAllFolders);
router.delete("/delete/:folderId", api_key_config_1.validateApiKey, folder_controller_1.deleteFolder);
exports.default = router;
//# sourceMappingURL=folder.routes.js.map