import { check } from 'express-validator';

export const createCategoryValidator = [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').optional(),
    check('coverImage').optional(),
    check('userId').notEmpty().withMessage('UserId is required')
];

export const getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category ID')
];

export const deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category ID')
];
