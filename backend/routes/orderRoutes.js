const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../validators/orderValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof OrderController.getAllOrders !== 'function') {
  throw new TypeError('OrderController.getAllOrders is not a function');
}
if (typeof OrderController.getOrderById !== 'function') {
  throw new TypeError('OrderController.getOrderById is not a function');
}
if (typeof OrderController.createOrder !== 'function') {
  throw new TypeError('OrderController.createOrder is not a function');
}
if (typeof OrderController.updateOrderStatus !== 'function') {
  throw new TypeError('OrderController.updateOrderStatus is not a function');
}

router.use(authenticate);

router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);

router.post('/', authorizeRoles(1, 2, 'Admin', 'Manager'), validateCreateOrder, OrderController.createOrder);
router.patch('/:id/status', authorizeRoles(1, 2, 'Admin', 'Manager'), validateUpdateOrderStatus, OrderController.updateOrderStatus);

module.exports = router;