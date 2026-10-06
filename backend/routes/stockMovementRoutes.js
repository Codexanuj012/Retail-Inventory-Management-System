const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovementController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety assertions
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not exported properly');
}

router.use(authenticate);

router.get('/', StockMovementController.getMovements);
router.post('/record', authorizeRoles(1, 2, 'Admin', 'Manager'), StockMovementController.recordMovement);
router.post('/transfer', authorizeRoles(1, 2, 'Admin', 'Manager'), StockMovementController.transferStock);

module.exports = router;