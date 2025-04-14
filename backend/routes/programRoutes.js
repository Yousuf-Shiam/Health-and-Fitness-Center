const express = require('express');
const router = express.Router();
const Program = require('../models/programModel');

// @desc    Create a new program
// @route   POST /api/programs
// @access  Private (Trainer/Nutritionist)
router.post('/', async (req, res) => {
  const { name, description, price, duration } = req.body;

  if (req.user.role !== 'trainer' && req.user.role !== 'nutritionist') {
    return res.status(403).json({ message: 'Only trainers and nutritionists can create programs' });
  }

  try {
    const program = new Program({
      name,
      description,
      creator: req.user._id,
      role: req.user.role,
      price,
      duration,
    });

    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Assign a program to a client
// @route   POST /api/programs/:id/assign
// @access  Private (Client)
router.post('/:id/assign', protect, async (req, res) => {
    const { startDate, startTime } = req.body;
  
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can assign programs' });
    }
  
    try {
      const program = await Program.findById(req.params.id);
  
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
  
      program.clients.push({
        client: req.user._id,
        startDate,
        startTime,
        status: 'active',
      });
  
      await program.save();
      res.status(200).json({ message: 'Program assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
router.get('/', async (req, res) => {
    try {
      const programs = await Program.find().populate('creator', 'name role').populate('clients.client', 'name');
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
module.exports = router;