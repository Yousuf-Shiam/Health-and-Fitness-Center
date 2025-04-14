const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, password, role, fitnessGoals, preferences } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password, // Note: Password should be hashed before saving (to be implemented)
      role,
      fitnessGoals,
      preferences,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      fitnessGoals: user.fitnessGoals,
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', async (req, res) => {
  const { name, fitnessGoals, preferences } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.fitnessGoals = fitnessGoals || user.fitnessGoals;
    user.preferences = preferences || user.preferences;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      fitnessGoals: updatedUser.fitnessGoals,
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;