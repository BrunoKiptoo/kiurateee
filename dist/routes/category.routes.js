"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const category_validators_1 = require("../middlewares/validators/category.validators");
const router = (0, express_1.Router)();
router.post('/new', category_validators_1.createCategoryValidator, category_controller_1.createCategory);
router.get('/all', category_controller_1.getCategories);
router.get('/category/:id', category_validators_1.getCategoryValidator, category_controller_1.getCategory);
router.delete('/category/:id', category_validators_1.deleteCategoryValidator, category_controller_1.deleteCategory);
router.delete('/delete_all', category_controller_1.deleteAllCategories);
exports.default = router;
//# sourceMappingURL=category.routes.js.map