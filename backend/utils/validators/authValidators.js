const { check } = require('express-validator');

exports.registerValidation = [
  check('username')
    .not().isEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  check('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  check('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  
  check('password')
    .exists()
    .withMessage('Password is required')
];