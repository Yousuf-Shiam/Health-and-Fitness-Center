const express = require('express');
const router = express.Router();
const {
  saveMealTracker,
  getMealTracker,
} = require('../controllers/mealTrackerController');

// Save meal tracker data
router.post('/', saveMealTracker);

// Get meal tracker data for a user
router.get('/:userId', getMealTracker);

module.exports = router;