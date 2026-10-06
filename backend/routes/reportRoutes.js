const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

// Safety checks
if (typeof authenticate !== 'function') {
  throw new TypeError('authenticate middleware is not defined properly');
}
if (typeof ReportController.getDashboardData !== 'function') {
  throw new TypeError('ReportController.getDashboardData is not a function');
}

router.use(authenticate);

router.get('/dashboard', ReportController.getDashboardData);

module.exports = router;