const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

router.post('/', authorizeRoles(1, 2, 'Admin', 'Manager'), CategoryController.createCategory);
router.put('/:id', authorizeRoles(1, 2, 'Admin', 'Manager'), CategoryController.updateCategory);
router.delete('/:id', authorizeRoles(1, 'Admin'), CategoryController.deleteCategory);

module.exports = router;