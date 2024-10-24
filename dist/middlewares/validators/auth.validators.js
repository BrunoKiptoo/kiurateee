"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithCodeValidator = exports.resetPasswordValidator = exports.updateUserValidator = exports.loginValidator = exports.unfollowUserValidator = exports.followUserValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const registerValidator = [
    (0, express_validator_1.check)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.check)('mobileNumber', 'Mobile number is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty(),
    (0, express_validator_1.check)('tag', 'Tag is required').not().isEmpty(),
    (0, express_validator_1.check)('profile_picture', 'Invalid profile picture URL').optional().isURL()
];
exports.registerValidator = registerValidator;
const loginValidator = [
    (0, express_validator_1.check)('mobileNumber', 'Mobile number is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty()
];
exports.loginValidator = loginValidator;
const resetPasswordValidator = [
    (0, express_validator_1.check)('mobileNumber', 'Mobile number is required').not().isEmpty()
];
exports.resetPasswordValidator = resetPasswordValidator;
const updateUserValidator = [
    (0, express_validator_1.check)('name', 'Name is optional').optional().not().isEmpty(),
    (0, express_validator_1.check)('mobileNumber', 'Mobile number is optional').optional().not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is optional').optional().not().isEmpty(),
    (0, express_validator_1.check)('tag', 'Tag is optional').optional().not().isEmpty(),
    (0, express_validator_1.check)('profile_picture', 'Invalid profile picture URL').optional().isURL() // Optional and should be a URL if provided
];
exports.updateUserValidator = updateUserValidator;
const resetPasswordWithCodeValidator = [
    (0, express_validator_1.check)('mobileNumber', 'Mobile number is required').not().isEmpty(),
    (0, express_validator_1.check)('resetCode', 'Reset code is required').not().isEmpty(),
    (0, express_validator_1.check)('newPassword', 'New password is required').not().isEmpty(),
    (0, express_validator_1.check)('confirmPassword', 'Password confirmation is required').not().isEmpty(),
    (0, express_validator_1.check)('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 }),
    (0, express_validator_1.check)('newPassword').custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            throw new Error('New password and confirmation do not match');
        }
        return true;
    })
];
exports.resetPasswordWithCodeValidator = resetPasswordWithCodeValidator;
const followUserValidator = [
    (0, express_validator_1.check)('userIdToFollow', 'User ID to follow is required')
        .not().isEmpty()
        .isMongoId().withMessage('Invalid User ID format'),
];
exports.followUserValidator = followUserValidator;
const unfollowUserValidator = [
    (0, express_validator_1.check)('userIdToUnfollow', 'User ID to unfollow is required')
        .not().isEmpty()
        .isMongoId().withMessage('Invalid User ID format'),
];
exports.unfollowUserValidator = unfollowUserValidator;
//# sourceMappingURL=auth.validators.js.map