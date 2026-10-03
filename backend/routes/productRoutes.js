const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { validateCreateProduct, validateUpdateProduct } = require('../validators/productValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

router.post('/', authorizeRoles(1, 2, 'Admin', 'Manager'), validateCreateProduct, ProductController.createProduct);
router.put('/:id', authorizeRoles(1, 2, 'Admin', 'Manager'), validateUpdateProduct, ProductController.updateProduct);
router.delete('/:id', authorizeRoles(1, 'Admin'), ProductController.deleteProduct);

module.exports = router;