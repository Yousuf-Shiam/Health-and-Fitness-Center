const { generateReceipt } = require('../models/PaymentModel');

// Initialize Stripe lazily to ensure environment variables are loaded
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const stripe = getStripe();
        const { amount, currency = 'usd', paymentMethodType = 'card', programId, clientId, programName } = req.body;

        if (!amount || !programId || !clientId) {
            return res.status(400).json({ 
                error: 'Amount, programId, and clientId are required' 
            });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency: currency,
            payment_method_types: [paymentMethodType],
            metadata: {
                programId: programId.toString(),
                clientId: clientId.toString(),
                programName: programName || 'Health & Fitness Program'
            },
        });

        console.log('💳 Payment Intent Created:', {
            id: paymentIntent.id,
            amount: amount,
            currency: currency,
            programName: programName
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
};

// Confirm payment and generate receipt
const confirmPayment = async (req, res) => {
    try {
        const stripe = getStripe();
        const { paymentIntentId, bookingId, clientName, serviceName, amount } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment Intent ID is required' });
        }

        // Retrieve the payment intent to verify it was successful
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            console.log('✅ Payment confirmed successfully:', paymentIntentId);
            
            // Generate receipt if all required data is provided
            if (bookingId && clientName && serviceName && amount) {
                generateReceipt(bookingId, clientName, serviceName, amount, res);
            } else {
                res.json({
                    success: true,
                    message: 'Payment successful!',
                    paymentIntent: {
                        id: paymentIntent.id,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency,
                        status: paymentIntent.status,
                        metadata: paymentIntent.metadata
                    }
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed',
                status: paymentIntent.status
            });
        }
    } catch (error) {
        console.error('❌ Error confirming payment:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const stripe = getStripe();
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata
        });
    } catch (error) {
        console.error('❌ Error retrieving payment status:', error);
        res.status(500).json({ error: error.message });
    }
};

// Webhook endpoint to handle Stripe events
const handleWebhook = async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('✅ Webhook signature verified successfully');
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('📥 Webhook Event Received:', {
        id: event.id,
        type: event.type,
        created: new Date(event.created * 1000).toISOString()
    });

    // Handle the event based on Stripe's event types
    try {
        switch (event.type) {
            case 'setup_intent.created':
                console.log('🔧 Setup Intent created:', event.data.object.id);
                break;

            case 'payment_intent.created':
                const createdPaymentIntent = event.data.object;
                console.log('💳 Payment Intent created:', {
                    id: createdPaymentIntent.id,
                    amount: createdPaymentIntent.amount,
                    currency: createdPaymentIntent.currency,
                    status: createdPaymentIntent.status
                });
                break;

            case 'payment_intent.succeeded':
                const succeededPaymentIntent = event.data.object;
                console.log('🎉 Payment succeeded:', {
                    id: succeededPaymentIntent.id,
                    amount: succeededPaymentIntent.amount / 100, // Convert from cents
                    currency: succeededPaymentIntent.currency,
                    metadata: succeededPaymentIntent.metadata
                });

                // Update your database here
                await handleSuccessfulPayment(succeededPaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                console.log('❌ Payment failed:', {
                    id: failedPaymentIntent.id,
                    last_payment_error: failedPaymentIntent.last_payment_error
                });

                // Handle failed payment
                await handleFailedPayment(failedPaymentIntent);
                break;

            case 'payment_intent.processing':
                const processingPaymentIntent = event.data.object;
                console.log('⏳ Payment processing:', processingPaymentIntent.id);
                break;

            case 'payment_intent.requires_action':
                const actionRequiredPaymentIntent = event.data.object;
                console.log('🔐 Payment requires action:', actionRequiredPaymentIntent.id);
                break;

            case 'payment_intent.canceled':
                const canceledPaymentIntent = event.data.object;
                console.log('🚫 Payment canceled:', canceledPaymentIntent.id);
                break;

            case 'payment_method.attached':
                const attachedPaymentMethod = event.data.object;
                console.log('🔗 Payment method attached:', attachedPaymentMethod.id);
                break;

            // Handle customer events if using customers
            case 'customer.created':
                const customer = event.data.object;
                console.log('👤 Customer created:', customer.id);
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log('🧾 Invoice payment succeeded:', invoice.id);
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('📋 Invoice payment failed:', failedInvoice.id);
                break;

            // Subscription events (if you plan to add subscriptions)
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                console.log(`🔄 Subscription ${event.type}:`, subscription.id);
                break;

            default:
                console.log(`🔔 Unhandled event type: ${event.type}`);
                console.log('Event data:', JSON.stringify(event.data.object, null, 2));
        }

        // Always acknowledge receipt of the event
        res.json({ 
            received: true, 
            event_id: event.id,
            event_type: event.type 
        });

    } catch (error) {
        console.error('❌ Error processing webhook event:', error);
        res.status(500).json({ 
            error: 'Webhook processing failed',
            event_id: event.id,
            event_type: event.type 
        });
    }
};

// Helper function to handle successful payments
const handleSuccessfulPayment = async (paymentIntent) => {
    try {
        const { metadata } = paymentIntent;
        
        // Update booking status in your database
        if (metadata.programId && metadata.clientId) {
            console.log('📝 Updating booking status for:', {
                programId: metadata.programId,
                clientId: metadata.clientId,
                programName: metadata.programName
            });
            
            // Import Booking model
            const Booking = require('../models/bookingModel');
            
            // Find and update the booking
            const updatedBooking = await Booking.findOneAndUpdate(
                { 
                    program: metadata.programId, 
                    client: metadata.clientId,
                    paymentStatus: 'unpaid' // Only update unpaid bookings
                },
                { 
                    paymentStatus: 'paid', 
                    paymentIntentId: paymentIntent.id,
                },
                { new: true }
            );
            
            if (updatedBooking) {
                console.log('✅ Booking payment status updated:', updatedBooking._id);
            } else {
                console.log('⚠️ No matching unpaid booking found');
            }
        }

        // Generate and store receipt
        const receiptData = await generateReceipt({
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            clientName: metadata.clientName || 'Customer',
            serviceName: metadata.programName || 'Health & Fitness Service',
            date: new Date()
        });

        console.log('🧾 Receipt generated:', receiptData.receiptId);

    } catch (error) {
        console.error('❌ Error handling successful payment:', error);
    }
};

// Helper function to handle failed payments
const handleFailedPayment = async (paymentIntent) => {
    try {
        const { metadata, last_payment_error } = paymentIntent;
        
        console.log('💸 Processing failed payment:', {
            paymentIntentId: paymentIntent.id,
            error: last_payment_error?.message,
            decline_code: last_payment_error?.decline_code,
            programId: metadata.programId
        });

        // TODO: Update booking status to failed
        // TODO: Send failure notification to customer
        // TODO: Log for manual review if needed

    } catch (error) {
        console.error('❌ Error handling failed payment:', error);
    }
};

// Create a customer (optional - for recurring payments or customer management)
const createCustomer = async (req, res) => {
    try {
        const stripe = getStripe();
        const { email, name, phone } = req.body;

        const customer = await stripe.customers.create({
            email,
            name,
            phone,
        });

        console.log('👤 Customer created:', customer.id);
        res.json({ customerId: customer.id });
    } catch (error) {
        console.error('❌ Error creating customer:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus,
    handleWebhook,
    createCustomer
};
