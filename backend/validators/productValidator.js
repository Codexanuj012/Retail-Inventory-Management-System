const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }
  next();
};

const validateCreateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category_id').isInt().withMessage('Valid Category ID is required'),
  body('unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('cost_price').isFloat({ min: 0 }).withMessage('Cost price must be a non-negative number'),
  body('reorder_level').optional().isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer'),
  handleValidationErrors
];

const validateUpdateProduct = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('category_id').optional().isInt().withMessage('Valid Category ID is required'),
  body('unit_price').optional().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('cost_price').optional().isFloat({ min: 0 }).withMessage('Cost price must be a non-negative number'),
  handleValidationErrors
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};