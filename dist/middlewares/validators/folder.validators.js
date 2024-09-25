"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFolderValidator = exports.addFolderValidator = void 0;
const express_validator_1 = require("express-validator");
const addFolderValidator = [
    (0, express_validator_1.check)('link', 'Link is required').not().isEmpty(),
    (0, express_validator_1.check)('link', 'Link must be a valid URL').isURL(),
    (0, express_validator_1.check)('category', 'Category ID is required').not().isEmpty(),
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').not().isEmpty(),
    (0, express_validator_1.check)('user_id', 'User ID is required').not().isEmpty()
];
exports.addFolderValidator = addFolderValidator;
const updateFolderValidator = [
    (0, express_validator_1.check)('link', 'Link must be a valid URL').optional().isURL(),
    (0, express_validator_1.check)('category', 'Category ID is required').optional().not().isEmpty(),
    (0, express_validator_1.check)('title', 'Title is required').optional().not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').optional().not().isEmpty(),
    (0, express_validator_1.check)('user_id', 'User ID is required').optional().not().isEmpty()
];
exports.updateFolderValidator = updateFolderValidator;
//# sourceMappingURL=folder.validators.js.map