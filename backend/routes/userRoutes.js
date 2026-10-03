const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All User management routes require authentication
router.use(authenticate);

// Admin & Manager can list users
router.get('/', authorizeRoles(1, 2, 'Admin', 'Manager'), UserController.getAllUsers);

// Admin & Manager can view specific user details
router.get('/:id', authorizeRoles(1, 2, 'Admin', 'Manager'), UserController.getUserById);

// Admin only can update user details and roles
router.put('/:id', authorizeRoles(1, 'Admin'), UserController.updateUser);

// Admin only can delete users
router.delete('/:id', authorizeRoles(1, 'Admin'), UserController.deleteUser);

module.exports = router;