const Session = require('../models/SessionModel'); // Replace with your actual session model
const { sendSessionNotification } = require('../controllers/notificationController');

// Book a session and send a notification
const bookSession = async (req, res) => {
  try {
    const { userId, programId, sessionDate } = req.body;

    // Create a new session
    const session = await Session.create({ userId, programId, sessionDate });

    // Send a session notification
    await sendSessionNotification(userId, session._id, sessionDate);

    res.status(201).json(session);
  } catch (error) {
    console.error('Error booking session:', error.message);
    res.status(500).json({ message: 'Error booking session', error: error.message });
  }
};

module.exports = { bookSession };