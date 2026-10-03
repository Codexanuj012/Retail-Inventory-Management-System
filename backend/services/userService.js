const User = require('../models/User');

class UserService {
  static async getAllUsers(pagination) {
    const { page, limit, offset, search, role_id } = pagination;
    const { users, total } = await User.findAll({ limit, offset, search, role_id });
    return { users, total };
  }

  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async updateUser(id, updateData) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const updated = await User.update(id, {
      first_name: updateData.first_name || user.first_name,
      last_name: updateData.last_name || user.last_name,
      phone: updateData.phone !== undefined ? updateData.phone : user.phone,
      role_id: updateData.role_id || user.role_id,
      is_active: updateData.is_active !== undefined ? updateData.is_active : user.is_active
    });

    if (!updated) {
      throw new Error('Failed to update user.');
    }

    return await User.findById(id);
  }

  static async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const deleted = await User.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete user.');
    }

    return true;
  }
}

module.exports = UserService;