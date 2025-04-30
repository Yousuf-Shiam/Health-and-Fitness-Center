const mongoose = require('mongoose');

const mealplanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance'],
      required: true,
    },
    preferences: {
      type: String,
    },
    mealPlan: [
      {
        meal: { type: String, required: true },
        items: { type: [String], required: true },
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nutritionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealPlan', mealplanSchema, 'mealplans');