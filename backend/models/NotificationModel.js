const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user receiving the notification
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['session', 'meal_plan', 'achievement'], // Type of notification
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel', // Dynamic reference to related models
    },
    relatedModel: {
      type: String,
      enum: ['Program', 'MealPlan'], // Related models (e.g., Program, MealPlan)
    },
    isRead: {
      type: Boolean,
      default: false, // Whether the notification has been read
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);