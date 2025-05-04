const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');

// Create a notification
router.post('/', protect, createNotification);

// Get all notifications for a user
router.get('/', protect, getNotifications);

// Mark a notification as read
router.put('/:notificationId/read', protect, markAsRead);

module.exports = router;