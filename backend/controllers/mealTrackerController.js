const MealTracker = require('../models/MealTrackerModel');

// Save meal tracker data
const saveMealTracker = async (req, res) => {
  try {
    const { mealTracker } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const userId = req.user._id;

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
    res.status(500).json({ message: 'Error saving meal tracker', error: error.message });
  }
};

// Get meal tracker data for the logged-in user
exports.getMealTracker = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mealTracker = await MealTracker.findOne({ userId });

    if (!mealTracker) {
      return res.status(404).json({ message: 'Meal tracker not found' });
    }

    // Only return the mealTracker field
    res.status(200).json(mealTracker.mealTracker);
  } catch (error) {
    console.error('Error fetching meal tracker:', error);
    res.status(500).json({ message: 'Error fetching meal tracker', error: error.message });
  }
};