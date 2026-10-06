const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }
  next();
};

const validateCreateOrder = [
  body('order_type').isIn(['PURCHASE', 'SALES']).withMessage('Order type must be PURCHASE or SALES'),
  body('warehouse_id').isInt().withMessage('Valid Warehouse ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required in order'),
  body('items.*.product_id').isInt().withMessage('Valid Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  handleValidationErrors
];

const validateUpdateOrderStatus = [
  body('status').isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']).withMessage('Invalid order status'),
  handleValidationErrors
];

module.exports = {
  validateCreateOrder,
  validateUpdateOrderStatus
};