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
}

module.exports = ReportController;