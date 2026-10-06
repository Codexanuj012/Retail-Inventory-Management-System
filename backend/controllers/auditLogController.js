const AuditLogService = require('../services/auditLogService');
const { successResponse } = require('../utils/response');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

class AuditLogController {
  static async getAuditLogs(req, res, next) {
    try {
      const { page, limit, offset } = getPaginationParams(req.query);
      const { user_id, entity, action } = req.query;

      const { logs, total } = await AuditLogService.getLogs({
        page,
        limit,
        offset,
        user_id,
        entity,
        action
      });

      const paginatedData = formatPaginatedResponse(logs, total, page, limit);
      return successResponse(res, 200, 'Audit logs retrieved successfully', paginatedData.data, paginatedData.meta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuditLogController;