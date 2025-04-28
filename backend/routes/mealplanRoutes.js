const express = require('express');
const { createMealPlan, getMealPlans } = require('../controllers/mealplanController');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Route to create a meal plan
router.post(
  '/',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('weight', 'Weight must be a number').isNumeric(),
    check('fitnessGoal', 'Fitness goal is required').not().isEmpty(),
    check('mealPlan', 'Meal plan must be an array').isArray(),
    check('mealPlan.*.meal', 'Each meal must have a name').not().isEmpty(),
    check('mealPlan.*.items', 'Each meal must have items').not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createMealPlan
);

// Route to get meal plans for a specific user
router.get('/:userId', (req, res, next) => {
  console.log('Get Meal Plans Request for User ID:', req.params.userId); // Debugging userId
  next();
}, getMealPlans);

module.exports = router;