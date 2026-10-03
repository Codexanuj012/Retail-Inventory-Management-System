const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }
  next();
};

const validateRegister = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role_id').optional().isInt().withMessage('Role ID must be an integer'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin
};