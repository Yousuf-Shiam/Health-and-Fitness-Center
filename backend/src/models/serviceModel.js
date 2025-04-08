const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true
    },
    trainer: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['available', 'booked', 'completed'],
        default: 'available'
    }
});

module.exports = mongoose.model('Service', serviceSchema);