"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryValidator = exports.getCategoryValidator = exports.createCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryValidator = [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.check)('description').optional(),
    (0, express_validator_1.check)('coverImage').optional(),
    (0, express_validator_1.check)('userId').notEmpty().withMessage('UserId is required')
];
exports.getCategoryValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid category ID')
];
exports.deleteCategoryValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Invalid category ID')
];
//# sourceMappingURL=category.validators.js.map