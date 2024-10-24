"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidator = void 0;
const express_validator_1 = require("express-validator");
const videoValidator = [
    (0, express_validator_1.check)('videoId', 'Video ID is required').not().isEmpty(),
    (0, express_validator_1.check)('source', 'Source is required').not().isEmpty(),
    (0, express_validator_1.check)('category', 'Category ID is required').not().isEmpty().isMongoId(),
    (0, express_validator_1.check)('userId', 'User ID is required').not().isEmpty().isMongoId(),
    (0, express_validator_1.check)('date', 'Invalid date format').optional().isISO8601(),
    (0, express_validator_1.check)('videodata', 'Video data is required').not().isEmpty()
];
exports.videoValidator = videoValidator;
//# sourceMappingURL=video.validators.js.map