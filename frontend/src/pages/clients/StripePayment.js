import React, { useState, useEffect } from 'react';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import StripeCheckoutForm from './StripeCheckoutForm';
import StripeElementsFixed from './StripeElementsFixed';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// We'll use CDN version until packages are properly installed
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5');

const StripePayment = () => {
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [program, setProgram] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    useEffect(() => {
        console.log('🔄 StripePayment component loaded, always fetching fresh booking data...');
        console.log('🔍 Booking ID from useParams:', bookingId);
        console.log('🔍 URL pathname:', location.pathname);
        
        if (!bookingId || bookingId === 'undefined') {
            console.error('❌ No valid booking ID found! Cannot fetch booking details.');
            setError('Invalid booking ID. Please return to bookings and try again.');
            return;
        }
        
        // Always fetch fresh booking details to ensure we have the correct data
        fetchBookingDetails();
    }, []);

    // Debug effect to track program changes
    useEffect(() => {
        if (program) {
            console.log('🔄 Program state updated:', program);
        }
    }, [program]);

    const fetchBookingDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const bookingDetails = await response.json();
                console.log('📦 Raw booking API response:', JSON.stringify(bookingDetails, null, 2));
                
                if (!bookingDetails.amount || !bookingDetails.programName) {
                    console.error('❌ Missing required booking data. Available fields:', Object.keys(bookingDetails));
                    console.error('❌ Amount:', bookingDetails.amount);
                    console.error('❌ Program Name:', bookingDetails.programName);
                    setError('Unable to load booking details. Please try again.');
                    return;
                }
                
                const programData = {
                    amount: bookingDetails.amount,
                    programName: bookingDetails.programName,
                    programId: bookingDetails.programId,
                    bookingId: bookingId,
                    clientName: bookingDetails.clientName,
                    description: `Payment for ${bookingDetails.programName}`
                };
                
                console.log('💰 Program data for payment:', programData);
                setProgram(programData);
                createPaymentIntent(programData);
            } else {
                console.error('❌ Failed to fetch booking details:', response.status, response.statusText);
                setError(`Failed to load booking details: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error fetching booking details:', error);
            setError(`Error loading booking details: ${error.message}`);
        }
    };

    const createPaymentIntent = async (programData) => {
        if (!programData) {
            console.error('❌ No program data provided to createPaymentIntent');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            console.log('🚀 Creating payment intent for:', {
                amount: programData.amount,
                programName: programData.programName,
                userId: user.id
            });

            const response = await fetch('http://localhost:5000/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: programData.amount,
                    currency: 'usd',
                    paymentMethodType: 'card',
                    programId: programData.programId,
                    clientId: user.id || 'demo-client',
                    programName: programData.programName,
                    bookingId: programData.bookingId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setClientSecret(data.clientSecret);
                setPaymentIntentId(data.paymentIntentId);
                console.log('✅ Payment Intent created successfully:', data.paymentIntentId);
            } else {
                throw new Error(data.error || 'Failed to create payment intent');
            }
        } catch (error) {
            console.error('❌ Payment Intent creation failed:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            console.log('🎉 Payment succeeded! Processing confirmation...', paymentIntent.id);
            
            // Confirm payment on backend and generate receipt
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/stripe/confirm-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    paymentIntentId: paymentIntent.id,
                    bookingId: bookingId, // Use the actual booking ID from URL params
                    clientName: program?.clientName || 'Client',
                    serviceName: program?.programName,
                    amount: program?.amount || 100
                }),
            });

            if (response.ok) {
                console.log('✅ Payment confirmation successful');
            }

            // Navigate to success page
            navigate('/payment-success', {
                state: {
                    paymentIntent,
                    programName: program?.programName || 'Program',
                    amount: program?.amount || 100
                }
            });
        } catch (error) {
            console.error('❌ Error confirming payment:', error);
            // Still navigate to success since payment was processed by Stripe
            navigate('/payment-success', {
                state: {
                    paymentIntent,
                    programName: program?.programName || 'Program',
                    amount: program?.amount || 100
                }
            });
        }
    };

    const handlePaymentError = (error) => {
        setError(error.message);
        console.error('❌ Payment failed:', error);
    };

    // Demo payment handler for when Stripe packages aren't available
    const handleDemoPayment = () => {
        alert(`Demo payment of $${program?.amount || 100} for ${program?.programName || 'Program'} would be processed here.\n\nInstalling Stripe packages to enable real payment processing...`);
        
        // Simulate successful payment
        setTimeout(() => {
            navigate('/payment-success', {
                state: {
                    paymentIntent: { id: 'demo_payment_' + Date.now(), amount: paymentData.amount * 100 },
                    programName: paymentData.programName,
                    amount: paymentData.amount,
                    isDemo: true
                }
            });
        }, 1000);
    };

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0f5132',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Arial, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSpinner}>
                    <div style={styles.spinner}></div>
                    <h3>Setting up secure payment...</h3>
                    <p>Please wait while we initialize your payment with Stripe.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorCard}>
                    <h3>⚠️ Payment Setup Error</h3>
                    <p>{error}</p>
                    <button 
                        style={styles.retryButton} 
                        onClick={createPaymentIntent}
                    >
                        Try Again
                    </button>
                    <button 
                        style={styles.backButton} 
                        onClick={() => navigate(-1)}
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingSpinner}>
                    <div style={styles.spinner}></div>
                    <h3>Initializing secure payment...</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.paymentCard}>
                <div style={styles.header}>
                    <h2 style={styles.title}>💳 Secure Stripe Payment</h2>
                    <div style={styles.paymentSummary}>
                        <h3>{program?.programName || 'Loading...'}</h3>
                        <p style={styles.amount}>${program?.amount || '...'}</p>
                        <p style={styles.description}>{program?.description || 'Payment for fitness program'}</p>
                    </div>
                </div>

                {/* Fixed Stripe Elements - Only render when we have program data and client secret */}
                {program && clientSecret ? (
                    <StripeElementsFixed
                        clientSecret={clientSecret}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        amount={program.amount}
                        programName={program.programName}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={styles.spinner}></div>
                        <p>Loading payment form...</p>
                        <p>Program: {program ? program.programName : 'Loading...'}</p>
                        <p>Amount: ${program ? program.amount : 'Loading...'}</p>
                        <p>Client Secret: {clientSecret ? 'Ready' : 'Creating...'}</p>
                    </div>
                )}
                
                {/* Full Stripe Elements (will work once packages are installed)
                <Elements options={options} stripe={stripePromise}>
                    <StripeCheckoutForm
                        clientSecret={clientSecret}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        amount={paymentData.amount}
                        programName={paymentData.programName}
                    />
                </Elements>
                */}
            </div>

            <div style={styles.footer}>
                <p style={styles.secureText}>🔒 Your payment is secured by Stripe</p>
                <p style={styles.secureSubtext}>
                    256-bit SSL encryption • PCI DSS compliant • Trusted by millions
                </p>
                <button 
                    style={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← Back to Payment Options
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paymentCard: {
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        border: '1px solid #e9ecef',
    },
    header: {
        padding: '2rem',
        backgroundColor: '#0f5132',
        color: '#ffffff',
        textAlign: 'center',
    },
    title: {
        margin: '0 0 1rem 0',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    paymentSummary: {
        marginTop: '1rem',
    },
    amount: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0.5rem 0',
        color: '#ffffff',
    },
    description: {
        opacity: 0.9,
        margin: '0.5rem 0 0 0',
        fontSize: '0.95rem',
    },
    loadingSpinner: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0f5132',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem auto',
    },
    errorCard: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '2px solid #dc3545',
        maxWidth: '400px',
        width: '100%',
    },
    retryButton: {
        marginTop: '1rem',
        marginRight: '0.5rem',
        padding: '0.8rem 1.5rem',
        backgroundColor: '#0f5132',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
    },
    secureText: {
        color: '#0f5132',
        fontSize: '1rem',
        margin: '0 0 0.5rem 0',
        fontWeight: '600',
    },
    secureSubtext: {
        color: '#6c757d',
        fontSize: '0.85rem',
        margin: '0 0 1.5rem 0',
    },
    backButton: {
        padding: '0.8rem 1.5rem',
        backgroundColor: '#6c757d',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    demoForm: {
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '8px',
        border: '2px dashed #dee2e6',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '1rem',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '0.8rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        marginTop: '0.5rem',
        backgroundColor: '#f5f5f5',
    },
    payButton: {
        padding: '1rem 2rem',
        backgroundColor: '#28a745',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginTop: '1rem',
        width: '100%',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0f5132',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
    },
};

// Add CSS animation for spinner
if (!document.querySelector('#stripe-spinner-animation')) {
    const style = document.createElement('style');
    style.id = 'stripe-spinner-animation';
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

export default StripePayment;
