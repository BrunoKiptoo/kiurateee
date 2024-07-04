"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createVideoValidator = [
    (0, express_validator_1.check)('videoId').notEmpty().withMessage('VideoId is required'),
    (0, express_validator_1.check)('source').notEmpty().withMessage('Source is required'),
    (0, express_validator_1.check)('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid Category ID'),
    // check('thumbnail').notEmpty().withMessage('Thumbnail is required'),
    // check('userId').notEmpty().withMessage('UserId is required').isMongoId().withMessage('Invalid User ID'),
    (0, express_validator_1.check)('date').optional().isDate(),
    (0, express_validator_1.check)('metadata').notEmpty().withMessage('Metadata is required')
];
//# sourceMappingURL=video.validators.js.map