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

// @desc    Update program details
// @route   PUT /api/programs/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  const { price, duration } = req.body;

  try {
    // Ensure the user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Find the program by ID
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Update the program details
    program.price = price || program.price;
    program.duration = duration || program.duration;
    const updatedProgram = await program.save();

    res.status(200).json({
      _id: updatedProgram.id,
      name: updatedProgram.name,
      price: updatedProgram.price,
      duration: updatedProgram.duration,
    });
  } catch (error) {
    console.error('Error updating program details:', error);
    res.status(500).json({ message: 'Failed to update program details', error: error.message });
  }
});

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Delete the program
    await Program.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Failed to delete program', error: error.message });
  }
});

module.exports = router;