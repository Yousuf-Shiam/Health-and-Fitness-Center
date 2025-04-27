const mongoose = require('mongoose');

const mealplanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  fitnessGoal: { type: String, required: true },
  preferences: { type: String },
  mealPlan: { type: Array, required: true }, // Array of meal details
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealplanSchema);