import { check } from 'express-validator';

const videoValidator = [
  check('videoId', 'Video ID is required').not().isEmpty(),
  check('source', 'Source is required').not().isEmpty(),
  check('category', 'Category ID is required').not().isEmpty().isMongoId(),
  check('date', 'Invalid date format').optional().isISO8601(),
  check('videodata', 'Video data is required').not().isEmpty()
];

export { videoValidator };
