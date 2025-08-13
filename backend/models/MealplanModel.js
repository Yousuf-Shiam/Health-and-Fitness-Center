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
        calories: { type: Number, default: 0 }, // New field for calorie intake
        recommendation: { type: String, default: '' }, // New field for meal-specific recommendation
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
    recommendations: {
      type: String, // Field to store recommendations from the nutritionist
      default: 'No recommendations given yet',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealPlan', mealplanSchema, 'mealplans');