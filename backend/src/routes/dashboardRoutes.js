const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route to get fitness progress
router.get('/progress', dashboardController.getFitnessProgress);

// Route to get meal tracking
router.get('/meal-tracking', dashboardController.getMealTracking);

// Route to get notifications
router.get('/notifications', dashboardController.getNotifications);

// Route to get reports
router.get('/reports', dashboardController.getReports);

module.exports = router;