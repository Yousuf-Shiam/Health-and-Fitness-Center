const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Workout = require('../models/workoutModel');

const router = express.Router();

// @desc    Get all workouts for the logged-in user
// @route   GET /api/workouts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workouts', error: error.message });
  }
});

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, caloriesBurned, date } = req.body;

  if (!name || !caloriesBurned || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const workout = new Workout({
      user: req.user._id,
      name,
      caloriesBurned,
      date,
    });

    const createdWorkout = await workout.save();
    res.status(201).json(createdWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add workout', error: error.message });
  }
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this workout' });
    }

    await workout.remove();
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workout', error: error.message });
  }
});

module.exports = router;