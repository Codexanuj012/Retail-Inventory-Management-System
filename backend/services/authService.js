const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class AuthService {
  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      const error = new Error('User with this email already exists.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(userData.password);
    const userId = await User.create({
      ...userData,
      password_hash: hashedPassword
    });

    const user = await User.findById(userId);
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role_name
    });

    return { user, token };
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('Your account is deactivated. Please contact administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role_name
    });

    // Remove password hash from user return object
    delete user.password_hash;

    return { user, token };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;