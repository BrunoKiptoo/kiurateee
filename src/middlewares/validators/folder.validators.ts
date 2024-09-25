import { check } from 'express-validator';

const addFolderValidator = [
  check('link', 'Link is required').not().isEmpty(),
  check('link', 'Link must be a valid URL').isURL(),
  check('category', 'Category ID is required').not().isEmpty(),
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('user_id', 'User ID is required').not().isEmpty()
];

const updateFolderValidator = [
    check('link', 'Link must be a valid URL').optional().isURL(),
    check('category', 'Category ID is required').optional().not().isEmpty(),
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('user_id', 'User ID is required').optional().not().isEmpty()
  ];

export { addFolderValidator, updateFolderValidator };
