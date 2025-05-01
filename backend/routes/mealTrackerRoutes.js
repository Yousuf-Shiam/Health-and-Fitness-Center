const express = require('express');
const router = express.Router();
const { saveMealTracker, getMealTracker } = require('../controllers/mealTrackerController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/mealtracker
// @desc    Save meal tracker data
// @access  Private
router.post('/', protect, saveMealTracker);

// @route   GET /api/mealtracker
// @desc    Get meal tracker data for the logged-in user
// @access  Private
router.get('/', protect, getMealTracker);

module.exports = router;