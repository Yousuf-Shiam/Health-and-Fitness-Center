const express = require('express');
const router = express.Router();
const {
  markNotificationAsRead,
  getUserNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for a user
router.get('/', protect, getUserNotifications);

// Mark a notification as read
router.put('/:notificationId/read', protect, markNotificationAsRead);

module.exports = router;