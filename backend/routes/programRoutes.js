const express = require('express');
const router = express.Router();
const Program = require('../models/programModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private (Trainer/Nutritionist)
router.post('/', protect, async (req, res) => {
  const { name, description, price, duration } = req.body;

  // Ensure only trainers or nutritionists can create programs
  if (req.user.role !== 'trainer' && req.user.role !== 'nutritionist') {
    return res.status(403).json({ message: 'Only trainers and nutritionists can create programs' });
  }

  try {
    const program = new Program({
      name,
      description,
      creator: req.user._id, // Set the creator as the logged-in user
      role: req.user.role, // Set the role (trainer or nutritionist)
      price,
      duration,
    });

    const createdProgram = await program.save();
    res.status(201).json(createdProgram); // Respond with the created program
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;