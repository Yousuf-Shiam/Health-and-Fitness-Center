// Generic notification sender for any event
exports.sendNotification = async ({ userId, title, message, type, relatedId, relatedModel }) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    });
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
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
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    await Notification.create({
      userId,
      title: 'Upcoming Session Reminder',
      message: `You have a session scheduled on ${formattedDate}. Don't forget to attend!`,
      type: 'session',
      relatedId: sessionId,
      relatedModel: 'Program',
    });
  } catch (error) {
    console.error('Error sending session notification:', error.message);
  }
};

// Send a booking request notification (with actions)
exports.sendBookingRequestNotification = async (userId, programName, sessionDate, bookingId) => {
  try {
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    await Notification.create({
      userId,
      title: 'Booking Request',
      message: `Please confirm your booking for "${programName}" scheduled on ${formattedDate}.`,
      type: 'booking_request',
      relatedId: bookingId,
      relatedModel: 'Booking',
      hasActions: true,
      actions: [
        { label: 'Cancel', action: 'cancel', style: 'danger' },
        { label: 'Confirm', action: 'confirm', style: 'primary' },
        { label: 'Reschedule', action: 'reschedule', style: 'secondary' }
      ],
      isActionable: true,
    });
  } catch (error) {
    console.error('Error sending booking request notification:', error.message);
  }
};

// Send a booking status change notification for clients
exports.sendBookingStatusNotification = async (userId, programName, sessionDate, newStatus) => {
  try {
    let title, message;
    
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    switch (newStatus) {
      case 'confirmed':
        title = 'Booking Confirmed';
        message = `Your booking for "${programName}" has been confirmed. You have a session scheduled on ${formattedDate}. Don't forget to attend!`;
        break;
      case 'cancelled':
        title = 'Booking Cancelled';
        message = `Your booking for "${programName}" scheduled on ${formattedDate} has been cancelled.`;
        break;
      case 'completed':
        title = 'Session Completed';
        message = `Your session for "${programName}" on ${formattedDate} has been completed. Great job!`;
        break;
      case 'active':
        title = 'Session Active';
        message = `Your session for "${programName}" is now active. Session time: ${formattedDate}.`;
        break;
      case 'pending':
        title = 'Booking Pending';
        message = `Your booking for "${programName}" is now pending approval. Session scheduled for ${formattedDate}.`;
        break;
      default:
        title = 'Booking Status Updated';
        message = `Your booking for "${programName}" status has been updated to ${newStatus}. Session: ${formattedDate}.`;
    }

    await Notification.create({
      userId,
      title,
      message,
      type: 'booking_confirmation',
      hasActions: false,
      isActionable: false,
    });
  } catch (error) {
    console.error('Error sending booking status notification:', error.message);
  }
};

// Send trainer-specific notifications
exports.sendTrainerNotification = async (trainerId, clientName, programName, sessionDate, notificationType) => {
  try {
    let title, message;
    
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    switch (notificationType) {
      case 'new_booking':
        title = 'New Training Program Booking';
        message = `${clientName} has booked your training program "${programName}". Session scheduled for ${formattedDate}. Please prepare for the session.`;
        break;
      case 'booking_confirmed':
        title = 'Training Session Confirmed';
        message = `Your training session "${programName}" with ${clientName} has been confirmed for ${formattedDate}.`;
        break;
      case 'booking_cancelled':
        title = 'Training Session Cancelled';
        message = `${clientName} has cancelled the training session "${programName}" scheduled for ${formattedDate}.`;
        break;
      case 'session_reminder':
        title = 'Upcoming Training Session';
        message = `Reminder: You have a training session "${programName}" with ${clientName} scheduled for ${formattedDate}.`;
        break;
      default:
        title = 'Training Program Update';
        message = `Update regarding your training program "${programName}" with ${clientName}.`;
    }

    await Notification.create({
      userId: trainerId,
      title,
      message,
      type: 'session',
      hasActions: false,
      isActionable: false,
    });
  } catch (error) {
    console.error('Error sending trainer notification:', error.message);
  }
};

// Send nutritionist-specific notifications
exports.sendNutritionistNotification = async (nutritionistId, clientName, programName, sessionDate, notificationType) => {
  try {
    let title, message;
    
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    switch (notificationType) {
      case 'new_booking':
        title = 'New Nutrition Program Booking';
        message = `${clientName} has booked your nutrition program "${programName}". Consultation scheduled for ${formattedDate}. Please prepare the meal plan.`;
        break;
      case 'booking_confirmed':
        title = 'Nutrition Consultation Confirmed';
        message = `Your nutrition consultation "${programName}" with ${clientName} has been confirmed for ${formattedDate}.`;
        break;
      case 'booking_cancelled':
        title = 'Nutrition Consultation Cancelled';
        message = `${clientName} has cancelled the nutrition consultation "${programName}" scheduled for ${formattedDate}.`;
        break;
      case 'meal_plan_request':
        title = 'Meal Plan Request';
        message = `${clientName} has requested a meal plan review for "${programName}". Please check and update their meal plan.`;
        break;
      default:
        title = 'Nutrition Program Update';
        message = `Update regarding your nutrition program "${programName}" with ${clientName}.`;
    }

    await Notification.create({
      userId: nutritionistId,
      title,
      message,
      type: 'meal_plan',
      hasActions: false,
      isActionable: false,
    });
  } catch (error) {
    console.error('Error sending nutritionist notification:', error.message);
  }
};

// Send a booking confirmation notification
exports.sendBookingConfirmationNotification = async (userId, programName, sessionDate) => {
  try {
    // Format the date properly
    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
      timeZoneName: 'long'
    });

    await Notification.create({
      userId,
      title: 'Booking Confirmed',
      message: `Your booking for "${programName}" has been confirmed. You have a session scheduled on ${formattedDate}. Don't forget to attend!`,
      type: 'booking_confirmation',
      hasActions: false,
      isActionable: false,
    });
  } catch (error) {
    console.error('Error sending booking confirmation notification:', error.message);
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

// Mark all notifications as read for a user
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
};

// Delete a single notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      userId: userId 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ userId });

    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Failed to delete all notifications' });
  }
};

// Handle notification actions (confirm, cancel, reschedule)
exports.handleNotificationAction = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { action } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark notification as no longer actionable
    notification.isActionable = false;
    notification.isRead = true;
    await notification.save();

    if (action === 'confirm') {
      // Handle booking confirmation
      if (notification.type === 'booking_request' && notification.relatedId) {
        const Booking = require('../models/bookingModel');
        const Program = require('../models/programModel');
        
        const booking = await Booking.findById(notification.relatedId).populate('program');
        if (booking) {
          booking.status = 'confirmed';
          await booking.save();

          // Send confirmation notification
          await exports.sendBookingConfirmationNotification(
            notification.userId,
            booking.program.name,
            booking.startDate
          );
        }
      }
    } else if (action === 'cancel') {
      // Handle booking cancellation
      if (notification.type === 'booking_request' && notification.relatedId) {
        const Booking = require('../models/bookingModel');
        const booking = await Booking.findById(notification.relatedId);
        if (booking) {
          booking.status = 'cancelled';
          await booking.save();
        }
      }
    }

    res.status(200).json({ message: 'Action processed successfully' });
  } catch (error) {
    console.error('Error handling notification action:', error);
    res.status(500).json({ message: 'Failed to process action' });
  }
};

// Get notifications for a specific user (by userId param or query)
exports.getUserNotifications = async (req, res) => {
  try {
    // Allow userId from params, query, or authenticated user
    const userId = req.params.userId || req.query.userId || (req.user && req.user.id);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Failed to fetch user notifications' });
  }
};

// Send payment completion notification
exports.sendPaymentCompletionNotification = async (userId, programName, amount, paymentIntentId, bookingId) => {
  try {
    const title = 'Payment Successful! 🎉';
    const message = `Your payment of $${amount} for "${programName}" has been processed successfully. Transaction ID: ${paymentIntentId.slice(-8)}`;

    await Notification.create({
      userId,
      title,
      message,
      type: 'payment_success',
      relatedId: bookingId,
      relatedModel: 'Booking',
      hasActions: false,
      isActionable: false,
    });

    console.log('✅ Payment completion notification sent to user:', userId);
  } catch (error) {
    console.error('❌ Error sending payment completion notification:', error.message);
  }
};

// Send payment failure notification
exports.sendPaymentFailureNotification = async (userId, programName, amount, error) => {
  try {
    const title = 'Payment Failed ❌';
    const message = `Your payment of $${amount} for "${programName}" could not be processed. Please try again or contact support. Error: ${error}`;

    await Notification.create({
      userId,
      title,
      message,
      type: 'payment_failed',
      hasActions: false,
      isActionable: false,
    });

    console.log('⚠️ Payment failure notification sent to user:', userId);
  } catch (error) {
    console.error('❌ Error sending payment failure notification:', error.message);
  }
};