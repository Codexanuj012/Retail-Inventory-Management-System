const StockMovementService = require('../services/stockMovementService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class StockMovementController {
  static async recordMovement(req, res, next) {
    try {
      const movement = await StockMovementService.recordMovement({
        ...req.body,
        user_id: req.user.id
      });
      return successResponse(res, 201, 'Stock movement recorded successfully', { movement });
    } catch (error) {
      next(error);
    }
  }

  static async transferStock(req, res, next) {
    try {
      const result = await StockMovementService.transferStock({
        ...req.body,
        user_id: req.user.id
      });
      return successResponse(res, 200, 'Stock transfer completed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getMovements(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { product_id, warehouse_id, movement_type } = req.query;

      const { movements, total } = await StockMovementService.getMovements({
        page,
        limit,
        offset,
        product_id,
        warehouse_id,
        movement_type
      });

      const paginatedData = formatPaginatedResponse(movements, total, page, limit);
      return successResponse(res, 200, 'Stock movements retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StockMovementController;