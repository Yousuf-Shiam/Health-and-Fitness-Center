const mongoose = require('mongoose');

const mealplanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the meal plan
    },
    description: {
      type: String,
      required: true, // Description of the meal plan
    },
    weight: {
      type: Number,
      required: true, // Weight of the client
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance'], // Fitness goal options
      required: true,
    },
    preferences: {
      type: String, // Dietary preferences (e.g., vegetarian, keto)
    },
    mealPlan: [
      {
        meal: { type: String, required: true }, // Name of the meal (e.g., Breakfast)
        items: { type: [String], required: true }, // List of items in the meal
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the meal plan
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('MealPlan', mealplanSchema);