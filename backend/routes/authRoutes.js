const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');

// Safety verification checks
if (!validateRegister || typeof validateRegister !== 'function' && !Array.isArray(validateRegister)) {
  throw new TypeError('validateRegister validator is not defined properly');
}
if (!validateLogin || typeof validateLogin !== 'function' && !Array.isArray(validateLogin)) {
  throw new TypeError('validateLogin validator is not defined properly');
}
if (typeof AuthController.register !== 'function') {
  throw new TypeError('AuthController.register is not a function');
}
if (typeof AuthController.login !== 'function') {
  throw new TypeError('AuthController.login is not a function');
}
if (typeof AuthController.getMe !== 'function') {
  throw new TypeError('AuthController.getMe is not a function');
}

// Auth endpoints
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/me', authenticate, AuthController.getMe);

module.exports = router;