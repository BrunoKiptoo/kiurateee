"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const addCategoryValidator = [
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').not().isEmpty(),
    (0, express_validator_1.check)('cover_image', 'Cover image URL is required').not().isEmpty(),
    (0, express_validator_1.check)('cover_image', 'Cover image URL must be a valid URL').isURL()
];
exports.addCategoryValidator = addCategoryValidator;
//# sourceMappingURL=admin.js.map