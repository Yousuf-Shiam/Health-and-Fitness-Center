const express = require('express');
const Booking = require('../models/bookingModel');
const { protect } = require('../middleware/authMiddleware');
const { path } = require('pdfkit');

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

// @desc    Reschedule booking
// @route   PUT /api/bookings/:id/reschedule
// @access  Private
router.put('/:id/reschedule', async (req, res) => {
  const { startDate } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.startDate = startDate;
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get bookings for projects created by the logged-in nutritionist
// @route   GET /api/bookings/nutritionist
// @access  Private (Nutritionist)
router.get('/nutritionist', protect, async (req, res) => {
  try {
    // Ensure the user has the 'nutritionist' role
    if (req.user.role !== 'nutritionist') {
      return res.status(403).json({ message: 'Only nutritionists can view these bookings.' });
    }

    // Fetch bookings where the program's creator is the logged-in nutritionist
    const bookings = await Booking.find()
      .populate({
        path: 'program',
        match: { creator: req.user.id }, // Match programs created by the logged-in nutritionist
        populate: {
          path: 'creator',
          select: 'name role', // Select only the name and role fields
        },
      })
      .populate('client', 'name'); // Populate the client field with the name

    // Filter out bookings where the program is null (not created by this nutritionist)
    const filteredBookings = bookings.filter((booking) => booking.program !== null);

    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// GET api/bookings/trainer
// @desc    Get bookings for projects created by the logged-in trainer
// @access  Private (Trainer)
router.get('/trainer', protect, async (req, res) => {
  try {
    // Ensure the user has the 'trainer' role
    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can view these bookings.' });
    }

    // Fetch bookings where the program's creator is the logged-in trainer
    const bookings = await Booking.find()
      .populate({
        path: 'program',
        match: { creator: req.user.id }, // Match programs created by the logged-in trainer
        populate: {
          path: 'creator',
          select: 'name role', // Select only the name and role fields
        },
      })
      .populate('client', 'name'); // Populate the client field with the name

      const filteredBookings = bookings.filter((booking) => booking.program !== null);

    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    // Ensure the user has the 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view all bookings.' });
    }

    // Fetch all bookings and populate related fields
    const bookings = await Booking.find()
      .populate('program', 'name price') // Populate program details
      .populate('client', 'name email'); // Populate client details

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
      const booking = await Booking.findById(req.params.id).populate({
          path: 'program',
          populate: {
              path: 'creator',
              select: 'name role',
          },
      });

      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({
          clientName: booking.client.name,
          email: booking.client.email,
          programName: booking.program.name,
          amount: booking.program.price,
          fitnessGoals: booking.client.fitnessGoals,
          preferences: booking.client.preferences,
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;