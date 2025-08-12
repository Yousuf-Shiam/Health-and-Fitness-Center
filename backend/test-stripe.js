const dotenv = require('dotenv');
dotenv.config();

// Test Stripe Integration
console.log('🧪 Testing Stripe Integration...\n');

// Check environment variables
console.log('✅ Environment Variables:');
console.log(`STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? 'Set (starts with: ' + process.env.STRIPE_SECRET_KEY.substring(0, 12) + '...)' : '❌ Not set'}`);
console.log(`STRIPE_PUBLISHABLE_KEY: ${process.env.STRIPE_PUBLISHABLE_KEY ? 'Set (starts with: ' + process.env.STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...)' : '❌ Not set'}`);
console.log(`STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : '❌ Not set'}\n`);

// Test Stripe initialization
try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe SDK: Successfully initialized\n');
    
    // Test basic Stripe API call
    stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd',
        payment_method_types: ['card'],
    }).then(paymentIntent => {
        console.log('✅ Stripe API Test: Payment Intent created successfully');
        console.log(`Payment Intent ID: ${paymentIntent.id}`);
        console.log(`Amount: $${paymentIntent.amount / 100}`);
        console.log(`Status: ${paymentIntent.status}\n`);
        
        console.log('🎉 All tests passed! Your Stripe integration is ready!');
    }).catch(error => {
        console.error('❌ Stripe API Test Failed:', error.message);
    });
    
} catch (error) {
    console.error('❌ Stripe SDK Initialization Failed:', error.message);
}
