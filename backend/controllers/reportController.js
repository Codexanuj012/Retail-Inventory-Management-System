const ReportService = require('../services/reportService');
const { successResponse } = require('../utils/response');

class ReportController {
  static async getDashboardData(req, res, next) {
    try {
      const data = await ReportService.getDashboardMetrics();
      return successResponse(res, 200, 'Dashboard summary metrics retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryValuation(req, res, next) {
    try {
      const data = await ReportService.getInventoryValuationReport();
      return successResponse(res, 200, 'Inventory valuation report retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getSalesReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const data = await ReportService.getSalesReport({ startDate, endDate });
      return successResponse(res, 200, 'Sales report retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;