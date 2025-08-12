const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      enum: ['session', 'meal_plan', 'achievement', 'booking_confirmation', 'booking_request'],
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
    },
    relatedModel: {
      type: String,
      enum: ['Program', 'MealPlan', 'Booking'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    hasActions: {
      type: Boolean,
      default: false,
    },
    actions: [{
      label: String,
      action: String,
      style: String, // 'primary', 'secondary', 'danger'
    }],
    isActionable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);