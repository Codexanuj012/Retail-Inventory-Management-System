const AuditLog = require('../models/AuditLog');

class AuditLogService {
  static async logAction(data) {
    return await AuditLog.create(data);
  }

  static async getLogs(params) {
    const { page, limit, offset, user_id, entity, action } = params;
    return await AuditLog.findAll({ limit, offset, user_id, entity, action });
  }
}

module.exports = AuditLogService;