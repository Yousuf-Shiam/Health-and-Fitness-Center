const express = require('express');
const router = express.Router();
const {
  saveMealTracker,
  getMealTracker,
} = require('../controllers/mealTrackerController');
const { protect } = require('../middleware/authMiddleware');

// Save meal tracker data
router.post('/', protect, saveMealTracker);

// Get meal tracker data for a user
router.get('/:userId', protect, getMealTracker);

module.exports = router;