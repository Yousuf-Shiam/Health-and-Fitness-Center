const express = require('express');
const Booking = require('../models/bookingModel');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Create a booking for a program
// @route   POST /api/bookings
// @access  Private (Client)
router.post('/', protect, async (req, res) => {
    const { programId, clientId, bookingDate } = req.body;
  
    try {
      // Ensure the user has the 'client' role
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book programs.' });
      }
  
      const booking = await Booking.create({
        client: clientId,
        program: programId,
        bookingDate,
      });
  
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create booking', error });
    }
  });


//Get bookings for a client
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id }).populate('program');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch bookings', error });
  }
});


module.exports = router;