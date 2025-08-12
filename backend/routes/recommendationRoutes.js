const express = require('express');
const { 
  getRecommendations, 
  updateUserPhysicalData 
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get BMI-based recommendations for the authenticated user
router.get('/bmi-recommendations', protect, getRecommendations);

// Update user's physical data (height, weight, age, gender)
router.put('/physical-data', protect, updateUserPhysicalData);

module.exports = router;
