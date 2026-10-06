const InventoryService = require('../services/inventoryService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class InventoryController {
  static async getInventory(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { warehouse_id, product_id, low_stock } = req.query;

      const { inventory, total } = await InventoryService.getInventoryList({
        page,
        limit,
        offset,
        warehouse_id,
        product_id,
        low_stock
      });

      const paginatedData = formatPaginatedResponse(inventory, total, page, limit);
      return successResponse(res, 200, 'Inventory levels retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req, res, next) {
    try {
      const updatedStock = await InventoryService.adjustStock(req.body);
      return successResponse(res, 200, 'Stock level adjusted successfully', { stock: updatedStock });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InventoryController;