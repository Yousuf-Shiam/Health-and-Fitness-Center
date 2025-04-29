const MealPlan = require('../models/MealplanModel'); // Import the MealPlan model

// @desc    Create a new meal plan
// @route   POST /api/mealplans
// @access  Private (Client)
exports.createMealPlan = async (req, res) => {
  const { name, description, weight, fitnessGoal, preferences, mealPlan } = req.body;

  try {
    // Create a new meal plan
    const newMealPlan = await MealPlan.create({
      name,
      description,
      weight,
      fitnessGoal,
      preferences,
      mealPlan,
      creator: req.user._id, // Use the authenticated user's ID
    });

    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Error creating meal plan', error });
  }
};

// @desc    Get all meal plans for the authenticated user
// @route   GET /api/mealplans
// @access  Private (Client)
exports.getMealPlans = async (req, res) => {
  try {
    // Fetch meal plans for the authenticated user
    const mealPlans = await MealPlan.find({ creator: req.user._id }); // Filter by the authenticated user's ID
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Error fetching meal plans', error });
  }
};