const express = require('express');
const Booking = require('../models/bookingModel');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Create a booking for a program
// @route   POST /api/bookings
// @access  Private (Client)
router.post('/', protect, async (req, res) => {
    const { programId, clientId, bookingDate, startDate } = req.body;
  
    try {
      // Ensure the user has the 'client' role
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can book programs.' });
      }
  
      const booking = await Booking.create({
        client: clientId,
        program: programId,
        bookingDate,
        startDate,
      });
  
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create booking', error });
    }
  });


//Get bookings for a client
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id }).populate({
      path: 'program',
      populate: {
        path: 'creator', // Populate the creator field inside the program
        select: 'name role', // Select only the name and role fields
      },
    })
    .populate('client', 'name');
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch bookings', error });
  }
});


// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status; // Update the status
    await booking.save();

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking status', error });
  }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking', error });
  }
});


module.exports = router;