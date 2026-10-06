const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/warehouseController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety verification checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof WarehouseController.getAllWarehouses !== 'function') {
  throw new TypeError('WarehouseController.getAllWarehouses is not a function');
}
if (typeof WarehouseController.getWarehouseById !== 'function') {
  throw new TypeError('WarehouseController.getWarehouseById is not a function');
}
if (typeof WarehouseController.createWarehouse !== 'function') {
  throw new TypeError('WarehouseController.createWarehouse is not a function');
}
if (typeof WarehouseController.updateWarehouse !== 'function') {
  throw new TypeError('WarehouseController.updateWarehouse is not a function');
}
if (typeof WarehouseController.deleteWarehouse !== 'function') {
  throw new TypeError('WarehouseController.deleteWarehouse is not a function');
}

router.use(authenticate);

router.get('/', WarehouseController.getAllWarehouses);
router.get('/:id', WarehouseController.getWarehouseById);

router.post('/', authorizeRoles(1, 2, 'Admin', 'Manager'), WarehouseController.createWarehouse);
router.put('/:id', authorizeRoles(1, 2, 'Admin', 'Manager'), WarehouseController.updateWarehouse);
router.delete('/:id', authorizeRoles(1, 'Admin'), WarehouseController.deleteWarehouse);

module.exports = router;