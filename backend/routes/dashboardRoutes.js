const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/stats').get(protect, admin, getDashboardStats);

module.exports = router;
