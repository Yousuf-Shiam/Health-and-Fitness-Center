// Stripe Webhook Test Script
// This script helps test webhook functionality locally

const express = require('express');
const app = express();

// Test webhook endpoint
app.use('/test-webhook', express.raw({ type: 'application/json' }));

app.post('/test-webhook', (req, res) => {
    console.log('🔍 Test Webhook Received:');
    console.log('Headers:', req.headers);
    console.log('Body type:', typeof req.body);
    console.log('Body length:', req.body ? req.body.length : 'No body');
    
    // Simulate webhook signature check
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        console.log('❌ No stripe-signature header found');
        return res.status(400).send('Missing stripe-signature header');
    }
    
    console.log('✅ Stripe signature header present:', signature.substring(0, 20) + '...');
    
    res.json({ 
        received: true, 
        timestamp: Date.now(),
        bodyLength: req.body ? req.body.length : 0
    });
});

// Test JSON endpoint for comparison
app.use(express.json());
app.post('/test-json', (req, res) => {
    console.log('🔍 Test JSON Received:', req.body);
    res.json({ received: true, data: req.body });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🧪 Webhook test server running on http://localhost:${PORT}`);
    console.log(`Test endpoints:`);
    console.log(`- POST http://localhost:${PORT}/test-webhook (raw body)`);
    console.log(`- POST http://localhost:${PORT}/test-json (JSON body)`);
});

// Example curl commands for testing:
/*
# Test raw webhook (simulates Stripe webhook)
curl -X POST http://localhost:3001/test-webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1234567890,v1=sample_signature" \
  -d '{"id":"evt_test","type":"payment_intent.succeeded","data":{"object":{"id":"pi_test"}}}'

# Test JSON endpoint
curl -X POST http://localhost:3001/test-json \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
*/
