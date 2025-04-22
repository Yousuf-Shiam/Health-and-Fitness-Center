const express = require('express');
const router = express.Router();
const { generateReceipt } = require('../models/PaymentModel');

// Route to handle "Pay Now" and generate a receipt
router.post('/generate-receipt', (req, res) => {
    const { bookingId, clientName, serviceName, amount } = req.body;

    if (!bookingId || !clientName || !serviceName || !amount) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Call the generateReceipt function
    generateReceipt(bookingId, clientName, serviceName, amount, res);
});

module.exports = router;