const MealTracker = require('../models/MealTrackerModel');

// Save meal tracker data
exports.saveMealTracker = async (req, res) => {
  const { mealTracker } = req.body;

  try {
    let tracker = await MealTracker.findOne({ userId: req.user._id });

    if (tracker) {
      // Update existing meal tracker
      tracker.mealTracker = mealTracker;
      await tracker.save();
    } else {
      // Create a new meal tracker
      tracker = await MealTracker.create({ userId: req.user._id, mealTracker });
    }

    res.status(200).json({ message: 'Meal tracker saved successfully', tracker });
  } catch (error) {
    console.error('Error saving meal tracker:', error);
    res.status(500).json({ message: 'Error saving meal tracker', error: error.message });
  }
};

// Get meal tracker data for the logged-in user
exports.getMealTracker = async (req, res) => {
  try {
    const tracker = await MealTracker.findOne({ userId: req.user._id });

    if (!tracker) {
      return res.status(404).json({ message: 'Meal tracker not found' });
    }

    res.status(200).json({ mealTracker: tracker.mealTracker });
  } catch (error) {
    console.error('Error fetching meal tracker:', error);
    res.status(500).json({ message: 'Error fetching meal tracker', error: error.message });
  }
};