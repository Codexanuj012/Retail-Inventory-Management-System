const express = require('express');
const router = express.Router();
const AuditLogController = require('../controllers/auditLogController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof AuditLogController.getAuditLogs !== 'function') {
  throw new TypeError('AuditLogController.getAuditLogs is not a function');
}

router.use(authenticate);

// Admin only access for audit trail
router.get('/', authorizeRoles(1, 'Admin'), AuditLogController.getAuditLogs);

module.exports = router;