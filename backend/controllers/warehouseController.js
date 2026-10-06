const WarehouseService = require('../services/warehouseService');
const { successResponse } = require('../utils/response');

class WarehouseController {
  static async getAllWarehouses(req, res, next) {
    try {
      const warehouses = await WarehouseService.getAllWarehouses();
      return successResponse(res, 200, 'Warehouses retrieved successfully', { warehouses });
    } catch (error) {
      next(error);
    }
  }

  static async getWarehouseById(req, res, next) {
    try {
      const warehouse = await WarehouseService.getWarehouseById(req.params.id);
      return successResponse(res, 200, 'Warehouse details retrieved successfully', { warehouse });
    } catch (error) {
      next(error);
    }
  }

  static async createWarehouse(req, res, next) {
    try {
      const warehouse = await WarehouseService.createWarehouse(req.body);
      return successResponse(res, 201, 'Warehouse created successfully', { warehouse });
    } catch (error) {
      next(error);
    }
  }

  static async updateWarehouse(req, res, next) {
    try {
      const warehouse = await WarehouseService.updateWarehouse(req.params.id, req.body);
      return successResponse(res, 200, 'Warehouse updated successfully', { warehouse });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWarehouse(req, res, next) {
    try {
      await WarehouseService.deleteWarehouse(req.params.id);
      return successResponse(res, 200, 'Warehouse deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WarehouseController;