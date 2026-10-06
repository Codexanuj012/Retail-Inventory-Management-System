const OrderService = require('../services/orderService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const order = await OrderService.createOrder(req.body, req.user.id);
      return successResponse(res, 201, 'Order created and processed successfully', { order });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { order_type, status, user_id } = req.query;

      const { orders, total } = await OrderService.getAllOrders({
        page,
        limit,
        offset,
        order_type,
        status,
        user_id
      });

      const paginatedData = formatPaginatedResponse(orders, total, page, limit);
      return successResponse(res, 200, 'Orders retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      return successResponse(res, 200, 'Order details retrieved successfully', { order });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);
      return successResponse(res, 200, 'Order status updated successfully', { order });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;