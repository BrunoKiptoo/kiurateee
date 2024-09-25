import { check } from 'express-validator';

const addCategoryValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('cover_image', 'Cover image URL is required').not().isEmpty(),
  check('cover_image', 'Cover image URL must be a valid URL').isURL()
];

export { addCategoryValidator };
