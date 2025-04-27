const express = require('express');
const { createMealPlan, getMealPlans } = require('../controllers/mealplanController');
const router = express.Router();

const { check, validationResult } = require('express-validator');

router.post(
  '/',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('weight', 'Weight must be a number').isNumeric(),
    check('fitnessGoal', 'Fitness goal is required').not().isEmpty(),
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
router.get('/:userId', getMealPlans); // Get meal plans for a user

module.exports = router;