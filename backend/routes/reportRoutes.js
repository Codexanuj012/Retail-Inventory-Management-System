const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Safety checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof ReportController.getDashboardData !== 'function') {
  throw new TypeError('ReportController.getDashboardData is not a function');
}
if (typeof ReportController.getInventoryValuation !== 'function') {
  throw new TypeError('ReportController.getInventoryValuation is not a function');
}
if (typeof ReportController.getSalesReport !== 'function') {
  throw new TypeError('ReportController.getSalesReport is not a function');
}

router.use(authenticate);

router.get('/dashboard', ReportController.getDashboardData);
router.get('/valuation', authorizeRoles(1, 2, 'Admin', 'Manager'), ReportController.getInventoryValuation);
router.get('/sales', authorizeRoles(1, 2, 'Admin', 'Manager'), ReportController.getSalesReport);

module.exports = router;