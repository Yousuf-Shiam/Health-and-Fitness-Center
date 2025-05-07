const Notification = require('../models/NotificationModel');

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, relatedModel } = req.body;

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

// Send a meal plan notification
exports.sendMealPlanNotification = async (userId, mealPlanId) => {
  try {
    await Notification.create({
      userId,
      title: 'Meal Plan Updated',
      message: 'Your meal plan has been updated. Check it out for new recommendations!',
      type: 'meal_plan',
      relatedId: mealPlanId,
      relatedModel: 'MealPlan',
    });
  } catch (error) {
    console.error('Error sending meal plan notification:', error.message);
  }
};

// Send a fitness achievement notification
exports.sendAchievementNotification = async (userId, achievement) => {
  try {
    await Notification.create({
      userId,
      title: 'Congratulations!',
      message: `You have achieved a new milestone: ${achievement}. Keep up the great work!`,
      type: 'achievement',
    });
  } catch (error) {
    console.error('Error sending achievement notification:', error.message);
  }
};

// Send a session notification
exports.sendSessionNotification = async (userId, sessionId, sessionDate) => {
  try {
    await Notification.create({
      userId,
      title: 'Upcoming Session Reminder',
      message: `You have a session scheduled on ${sessionDate}. Don't forget to attend!`,
      type: 'session',
      relatedId: sessionId,
      relatedModel: 'Program',
    });
  } catch (error) {
    console.error('Error sending session notification:', error.message);
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

exports.getUserNotifications = async (req, res) => {
  // Function logic
};