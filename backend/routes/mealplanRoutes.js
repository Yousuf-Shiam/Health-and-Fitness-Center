const express = require('express');
const router = express.Router();
const {
  createMealPlan,
  getMealPlans,
  assignNutritionist,
  updateApprovalStatus,
  getAssignedMealPlans,
  updateMealPlan,
  updateRecommendations, // Import the new controller function
} = require('../controllers/mealplanController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// @route   POST /api/mealplans
// @desc    Create a new meal plan
// @access  Private (Client)
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

// @route   GET /api/mealplans
// @desc    Get all meal plans for the authenticated user
// @access  Private (Client)
router.get('/', protect, getMealPlans);

// @route   PUT /api/mealplans/:id/assign-nutritionist
// @desc    Assign a nutritionist to a meal plan
// @access  Private (Client)
router.put('/:id/assign-nutritionist', protect, assignNutritionist);

// @route   PUT /api/mealplans/:id/approval-status
// @desc    Update approval status of a meal plan
// @access  Private (Nutritionist)
router.put('/:id/approval-status', protect, updateApprovalStatus);

// @route   GET /api/mealplans/assigned
// @desc    Get all meal plans assigned to the logged-in nutritionist
// @access  Private (Nutritionist)
router.get('/assigned', protect, getAssignedMealPlans);

// @route   PUT /api/mealplans/:id
// @desc    Update a meal plan
// @access  Private (Nutritionist)
router.put('/:id', protect, updateMealPlan);

// @route   PUT /api/mealplans/:id/recommendations
// @desc    Update recommendations for a meal plan
// @access  Private (Nutritionist)
router.put('/:id/recommendations', protect, updateRecommendations);

// @route   GET /api/mealplans/all
// @desc    Get all meal plans
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    // Ensure the user has the 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all meal plans.' });
    }

    // Fetch all meal plans
    const mealPlans = await MealPlan.find();
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching all meal plans:', error);
    res.status(500).json({ message: 'Failed to fetch meal plans', error: error.message });
  }
});

// @route   DELETE /api/mealplans/:id
// @desc    Delete a meal plan
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Ensure the user has the 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete meal plans.' });
    }

    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    await MealPlan.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ message: 'Failed to delete meal plan', error: error.message });
  }
});

module.exports = router;