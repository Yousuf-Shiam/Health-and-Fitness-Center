// This file contains functions for managing the dashboard, including retrieving fitness progress, meal tracking, and notifications.

const Progress = require('../models/reportModel');

// Get dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const progressData = await Progress.find({ userId });

        if (!progressData) {
            return res.status(404).json({ message: 'No progress data found' });
        }

        res.status(200).json(progressData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get notifications
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const notifications = await Progress.find({ userId, type: 'notification' });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};