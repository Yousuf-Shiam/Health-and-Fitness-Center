const express = require('express');
const router = express.Router();
const { createMealPlan, getMealPlans } = require('../controllers/mealplanController');
const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware
const { check, validationResult } = require('express-validator');

// @desc    Create a new meal plan
// @route   POST /api/mealplans
// @access  Private (Client)
router.post(
  '/',
  protect, // Ensure the user is authenticated
  [
    check('name', 'Meal Plan Name is required').not().isEmpty(),
    check('description', 'Meal Plan Description is required').not().isEmpty(),
    check('weight', 'Weight must be a number').isNumeric(),
    check('fitnessGoal', 'Fitness goal is required').not().isEmpty(),
    check('mealPlan', 'Meal plan must be an array').isArray(),
    check('mealPlan.*.meal', 'Each meal must have a name').not().isEmpty(),
    check('mealPlan.*.items', 'Each meal must have items').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, weight, fitnessGoal, preferences, mealPlan } = req.body;

      // Create a new meal plan using the controller
      const newMealPlan = await MealPlan.create({
        name,
        description,
        weight,
        fitnessGoal,
        preferences,
        mealPlan,
        creator: req.user._id, // Use the authenticated user's ID
      });

      res.status(201).json(mealPlanData);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      res.status(500).json({ message: 'Failed to create meal plan', error });
    }
  }
);

// @desc    Get all meal plans for the authenticated user
// @route   GET /api/mealplans
// @access  Private (Client)
router.get('/', protect, async (req, res) => {
  try {
    // Fetch meal plans for the authenticated user
    const mealPlans = await getMealPlans(req.user._id);
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Failed to fetch meal plans', error });
  }
});

module.exports = router;