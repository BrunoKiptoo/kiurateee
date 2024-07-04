import { check } from 'express-validator';

export const createVideoValidator = [
    check('videoId').notEmpty().withMessage('VideoId is required'),
    check('source').notEmpty().withMessage('Source is required'),
    check('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid Category ID'),
    // check('thumbnail').notEmpty().withMessage('Thumbnail is required'),
    // check('userId').notEmpty().withMessage('UserId is required').isMongoId().withMessage('Invalid User ID'),
    check('date').optional().isDate(),
    check('metadata').notEmpty().withMessage('Metadata is required')
];
