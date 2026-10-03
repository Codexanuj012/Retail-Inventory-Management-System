const AuthService = require('../services/authService');
const { successResponse } = require('../utils/response');

class AuthController {
  static async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      return successResponse(res, 201, 'User registered successfully', { user, token });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      return successResponse(res, 200, 'Login successful', { user, token });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return successResponse(res, 200, 'User profile fetched successfully', { user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;