// Test file to check what's imported from stripeController
const controller = require('./controllers/stripeController');

console.log('📊 Stripe Controller Functions:');
console.log('createPaymentIntent:', typeof controller.createPaymentIntent);
console.log('confirmPayment:', typeof controller.confirmPayment);
console.log('getPaymentStatus:', typeof controller.getPaymentStatus);
console.log('handleWebhook:', typeof controller.handleWebhook);
console.log('createCustomer:', typeof controller.createCustomer);

module.exports = {};
