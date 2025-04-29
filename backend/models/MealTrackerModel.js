const mongoose = require('mongoose');

const mealTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealTracker: {
      Monday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Tuesday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Wednesday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Thursday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Friday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Saturday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
      Sunday: {
        breakfast: { type: String, default: '' },
        lunch: { type: String, default: '' },
        dinner: { type: String, default: '' },
        snacks: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MealTracker', mealTrackerSchema, 'mealtrackers');