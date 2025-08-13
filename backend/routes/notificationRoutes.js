const express = require('express');
const router = express.Router();
const {
  markNotificationAsRead,
  getUserNotifications,
  handleNotificationAction,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for a user
router.get('/', protect, getUserNotifications);

// Mark a notification as read
router.put('/:notificationId/read', protect, markNotificationAsRead);

// Mark all notifications as read
router.put('/mark-all-read', protect, markAllNotificationsAsRead);

// Delete a single notification
router.delete('/:notificationId', protect, deleteNotification);

// Delete all notifications for a user
router.delete('/delete-all', protect, deleteAllNotifications);

// Handle notification actions (confirm, cancel, reschedule)
router.post('/:notificationId/action', protect, handleNotificationAction);

module.exports = router;