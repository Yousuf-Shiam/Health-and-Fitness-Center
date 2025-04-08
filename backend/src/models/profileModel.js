const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fitnessGoals: {
        type: String,
        required: true,
    },
    preferences: {
        type: String,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);