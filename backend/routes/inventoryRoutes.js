const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof InventoryController.getInventory !== 'function') {
  throw new TypeError('InventoryController.getInventory is not a function');
}
if (typeof InventoryController.adjustStock !== 'function') {
  throw new TypeError('InventoryController.adjustStock is not a function');
}

router.use(authenticate);

router.get('/', InventoryController.getInventory);
router.post('/adjust', authorizeRoles(1, 2, 'Admin', 'Manager'), InventoryController.adjustStock);

module.exports = router;