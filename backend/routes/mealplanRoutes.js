const express = require('express');
const router = express.Router();
const { createMealPlan, getMealPlans } = require('../controllers/mealplanController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.post(
  '/',
  protect,
  [
    check('name', 'Meal Plan Name is required').not().isEmpty(),
    check('description', 'Meal Plan Description is required').not().isEmpty(),
    check('weight', 'Weight must be a number').isNumeric(),
    check('fitnessGoal', 'Fitness goal is required').not().isEmpty(),
    check('mealPlan', 'Meal plan must be an array').isArray(),
    check('mealPlan.*.meal', 'Each meal must have a name').not().isEmpty(),
    check('mealPlan.*.items', 'Each meal must have items').not().isEmpty(),
  ],
  createMealPlan
);

router.get('/', protect, getMealPlans);

module.exports = router; // Ensure the router is exported