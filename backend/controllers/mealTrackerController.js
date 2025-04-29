const MealTracker = require('../models/MealTrackerModel');

// Save meal tracker data
const saveMealTracker = async (req, res) => {
  try {
    const { userId, mealTracker } = req.body;

    // Validate input
    if (!userId || !mealTracker) {
      return res.status(400).json({ message: 'User ID and meal tracker data are required.' });
    }

    // Check if a meal tracker already exists for the user
    const existingTracker = await MealTracker.findOne({ userId });
    if (existingTracker) {
      // Update the existing tracker
      existingTracker.mealTracker = mealTracker;
      await existingTracker.save();
      return res.status(200).json({ message: 'Meal tracker updated successfully' });
    }

    // Create a new meal tracker
    const newMealTracker = new MealTracker({ userId, mealTracker });
    await newMealTracker.save();
    res.status(201).json({ message: 'Meal tracker saved successfully' });
  } catch (error) {
    console.error('Error saving meal tracker:', error);
    res.status(500).json({ message: 'Failed to save meal tracker', error: error.message });
  }
};

// Get meal tracker data for a user
const getMealTracker = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const mealTracker = await MealTracker.findOne({ userId });
    if (!mealTracker) {
      return res.status(404).json({ message: 'Meal tracker not found' });
    }

    res.status(200).json({ mealTracker });
  } catch (error) {
    console.error('Error fetching meal tracker:', error);
    res.status(500).json({ message: 'Failed to fetch meal tracker', error: error.message });
  }
};

module.exports = { saveMealTracker, getMealTracker };