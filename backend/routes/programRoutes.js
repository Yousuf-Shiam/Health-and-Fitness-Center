const express = require('express');
const router = express.Router();
const Program = require('../models/programModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private (Trainer/Nutritionist)
router.post('/', protect, async (req, res) => {
  const { name, description, price, duration, role } = req.body;

  if (!name || !description || !price || !duration || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const program = await Program.create({
      name,
      description,
      price,
      duration,
      role,
      creator: req.user._id, // Ensure the user is authenticated
    });

    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Failed to create program', error });
  }
});

// @desc    Get all fitness programs
// @route   GET /api/programs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find().populate('creator', 'name role'); // Populate creator details
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Failed to fetch programs', error });
  }
});

module.exports = router;