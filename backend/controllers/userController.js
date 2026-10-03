const UserService = require('../services/userService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { search, role_id } = req.query;

      const { users, total } = await UserService.getAllUsers({
        page,
        limit,
        offset,
        search,
        role_id
      });

      const paginatedData = formatPaginatedResponse(users, total, page, limit);
      return successResponse(res, 200, 'Users retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return successResponse(res, 200, 'User details retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      return successResponse(res, 200, 'User updated successfully', { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await UserService.deleteUser(req.params.id);
      return successResponse(res, 200, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;