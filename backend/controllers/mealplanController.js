const MealPlan = require('../models/MealplanModel'); // Import the MealPlan model
const User = require('../models/userModel'); // Import the User model

// @desc    Create a new meal plan
// @route   POST /api/mealplans
// @access  Private (Client)
exports.createMealPlan = async (req, res) => {
  const { name, description, weight, fitnessGoal, preferences, mealPlan } = req.body;

  console.log('Request Body:', req.body); // Debugging log
  console.log('Authenticated User:', req.user); // Debugging log

  try {
    // Create a new meal plan
    const newMealPlan = await MealPlan.create({
      name,
      description,
      weight,
      fitnessGoal,
      preferences,
      mealPlan,
      creator: req.user._id, // Use the authenticated user's ID
    });

    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Error creating meal plan', error });
  }
};

// @desc    Get all meal plans for the authenticated user
// @route   GET /api/mealplans
// @access  Private (Client)
exports.getMealPlans = async (req, res) => {
  try {
    // Fetch meal plans for the authenticated user and populate the nutritionist field
    const mealPlans = await MealPlan.find({ creator: req.user._id }).populate('nutritionist', 'name email');
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ message: 'Error fetching meal plans', error });
  }
};

// Assign a nutritionist to a meal plan
exports.assignNutritionist = async (req, res) => {
  const { nutritionistId } = req.body;

  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    const nutritionist = await User.findById(nutritionistId);
    if (!nutritionist || nutritionist.role !== 'nutritionist') {
      return res.status(400).json({ message: 'Invalid nutritionist' });
    }

    mealPlan.nutritionist = nutritionistId;
    await mealPlan.save();

    res.status(200).json({ message: 'Nutritionist assigned successfully', mealPlan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update approval status of a meal plan
exports.updateApprovalStatus = async (req, res) => {
  const { approvalStatus } = req.body;

  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    mealPlan.approvalStatus = approvalStatus;
    await mealPlan.save();

    res.status(200).json({ message: 'Approval status updated successfully', mealPlan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get all meal plans assigned to the logged-in nutritionist
// @route   GET /api/mealplans/assigned
// @access  Private (Nutritionist)
exports.getAssignedMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ nutritionist: req.user._id }).populate('creator', 'name email');
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching assigned meal plans:', error);
    res.status(500).json({ message: 'Error fetching assigned meal plans', error });
  }
};

// @desc    Update a meal plan
// @route   PUT /api/mealplans/:id
// @access  Private (Nutritionist)
exports.updateMealPlan = async (req, res) => {
  const { mealPlan } = req.body;

  try {
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      { mealPlan },
      { new: true }
    ).populate('creator', 'name email');

    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Error updating meal plan', error });
  }
};
