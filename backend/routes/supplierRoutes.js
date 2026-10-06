const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Supplier route placeholder' });
});

module.exports = router;