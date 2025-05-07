const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Meal = require('../models/mealModel');

const router = express.Router();

// @desc    Get all meals for the logged-in user
// @route   GET /api/meals
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user._id });
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meals', error: error.message });
  }
});

// @desc    Add a new meal
// @route   POST /api/meals
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, calories, date } = req.body;

  if (!name || !calories || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const meal = new Meal({
      user: req.user._id,
      name,
      calories,
      date,
    });

    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add meal', error: error.message });
  }
});

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this meal' });
    }

    await meal.remove();
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meal', error: error.message });
  }
});

module.exports = router;