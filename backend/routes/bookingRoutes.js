const express = require('express');
const Booking = require('../models/bookingModel');
const { protect } = require('../middleware/authMiddleware');

const {
  sendBookingConfirmationNotification,
  sendBookingRequestNotification,
  sendBookingStatusNotification,
  sendTrainerNotification,
  sendNutritionistNotification,
} = require('../controllers/notificationController');
const Program = require('../models/programModel');
const User = require('../models/userModel');

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

      // Get program details for notification
      const program = await Program.findById(programId).populate('creator', 'name role');
      const client = await User.findById(clientId, 'name');
      
      if (program && client) {
        // Send booking request notification to client (with actions)
        await sendBookingRequestNotification(clientId, program.name, startDate, booking._id);
        
        // Send role-specific notification to program creator (trainer/nutritionist)
        if (program.creator.role === 'trainer') {
          await sendTrainerNotification(
            program.creator._id, 
            client.name, 
            program.name, 
            startDate, 
            'new_booking'
          );
        } else if (program.creator.role === 'nutritionist') {
          await sendNutritionistNotification(
            program.creator._id, 
            client.name, 
            program.name, 
            startDate, 
            'new_booking'
          );
        }
      }

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
    console.log('Updating booking status:', { bookingId: req.params.id, status }); // Debug log

    const booking = await Booking.findById(req.params.id)
      .populate('program')
      .populate('client', 'name')
      .populate({
        path: 'program',
        populate: {
          path: 'creator',
          select: 'name role'
        }
      });

    if (!booking) {
      console.log('Booking not found:', req.params.id); // Debug log
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status; // Update the status
    await booking.save();
    console.log('Booking status updated successfully'); // Debug log

    // Send status change notification to client
    try {
      if (booking.program) {
        await sendBookingStatusNotification(
          booking.client._id,
          booking.program.name,
          booking.startDate,
          status
        );

        // Send role-specific notification to program creator (trainer/nutritionist)
        if (booking.program.creator) {
          const notificationType = status === 'confirmed' ? 'booking_confirmed' : 
                                  status === 'cancelled' ? 'booking_cancelled' : 'session_reminder';
          
          if (booking.program.creator.role === 'trainer') {
            await sendTrainerNotification(
              booking.program.creator._id,
              booking.client.name,
              booking.program.name,
              booking.startDate,
              notificationType
            );
          } else if (booking.program.creator.role === 'nutritionist') {
            await sendNutritionistNotification(
              booking.program.creator._id,
              booking.client.name,
              booking.program.name,
              booking.startDate,
              notificationType
            );
          }
        }
      }
    } catch (notificationError) {
      console.error('Failed to send notification, but booking was updated:', notificationError.message);
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Failed to update booking status:', error); // Debug log
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
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

    // Notify both client and program creator about reschedule
    const program = await Program.findById(booking.program);
    if (program) {
      await sendSessionNotification(program.creator, booking._id, startDate);
    }
    await sendSessionNotification(booking.client, booking._id, startDate);

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