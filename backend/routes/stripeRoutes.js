const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus,
    handleWebhook,
    createCustomer
} = require('../controllers/stripeController');
const { protect: authMiddleware } = require('../middleware/authMiddleware');

// Create payment intent
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

// Confirm payment and generate receipt
router.post('/confirm-payment', authMiddleware, confirmPayment);

// Get payment status
router.get('/payment-status/:paymentIntentId', authMiddleware, getPaymentStatus);

// Create customer (optional)
router.post('/create-customer', authMiddleware, createCustomer);

// Webhook endpoint (no auth required - Stripe handles verification)
// This route uses raw body parsing middleware configured in server.js
router.post('/webhook', handleWebhook);

module.exports = router;
