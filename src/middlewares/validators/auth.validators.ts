import { check } from 'express-validator';

const registerValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('mobileNumber', 'Mobile number is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('tag', 'Tag is required').not().isEmpty(),
  check('profile_picture', 'Invalid profile picture URL').optional().isURL() 
];

const loginValidator = [
    check('mobileNumber', 'Mobile number is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ];
  

  const resetPasswordValidator = [
    check('mobileNumber', 'Mobile number is required').not().isEmpty()
  ];

  const updateUserValidator = [
    check('name', 'Name is optional').optional().not().isEmpty(),
    check('mobileNumber', 'Mobile number is optional').optional().not().isEmpty(),
    check('password', 'Password is optional').optional().not().isEmpty(),
    check('tag', 'Tag is optional').optional().not().isEmpty(),
    check('profile_picture', 'Invalid profile picture URL').optional().isURL() // Optional and should be a URL if provided
  ];
  

const resetPasswordWithCodeValidator = [
    check('mobileNumber', 'Mobile number is required').not().isEmpty(),
    check('resetCode', 'Reset code is required').not().isEmpty(),
    check('newPassword', 'New password is required').not().isEmpty(),
    check('confirmPassword', 'Password confirmation is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters long').isLength({ min: 6 }),
    check('newPassword').custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }
      return true;
    })
  ];


  const followUserValidator = [
    check('userIdToFollow', 'User ID to follow is required').not().isEmpty().isMongoId().withMessage('Invalid User ID')
  ];
  
  const unfollowUserValidator = [
    check('userIdToUnfollow', 'User ID to unfollow is required').not().isEmpty().isMongoId().withMessage('Invalid User ID')
  ];
  
export { registerValidator, followUserValidator, unfollowUserValidator, loginValidator, updateUserValidator, resetPasswordValidator, resetPasswordWithCodeValidator };
