const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplierController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof SupplierController.getAllSuppliers !== 'function') {
  throw new TypeError('SupplierController.getAllSuppliers is not a function');
}
if (typeof SupplierController.getSupplierById !== 'function') {
  throw new TypeError('SupplierController.getSupplierById is not a function');
}
if (typeof SupplierController.createSupplier !== 'function') {
  throw new TypeError('SupplierController.createSupplier is not a function');
}
if (typeof SupplierController.updateSupplier !== 'function') {
  throw new TypeError('SupplierController.updateSupplier is not a function');
}
if (typeof SupplierController.deleteSupplier !== 'function') {
  throw new TypeError('SupplierController.deleteSupplier is not a function');
}

router.use(authenticate);

router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierController.getSupplierById);

router.post('/', authorizeRoles(1, 2, 'Admin', 'Manager'), SupplierController.createSupplier);
router.put('/:id', authorizeRoles(1, 2, 'Admin', 'Manager'), SupplierController.updateSupplier);
router.delete('/:id', authorizeRoles(1, 'Admin'), SupplierController.deleteSupplier);

module.exports = router;