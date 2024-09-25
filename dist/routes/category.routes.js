"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_key_config_1 = require("../config/api-key.config");
const validate_request_1 = require("../middlewares/validate-request");
const category_validators_1 = require("../middlewares/validators/category.validators");
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.post("/add-category", api_key_config_1.validateApiKey, category_validators_1.addCategoryValidator, validate_request_1.validate, category_controller_1.addCategory);
router.get("/all", api_key_config_1.validateApiKey, category_controller_1.getAllCategories);
router.post("/select-categories", api_key_config_1.validateApiKey, category_controller_1.selectCategoriesAsUser);
exports.default = router;
//# sourceMappingURL=category.routes.js.map