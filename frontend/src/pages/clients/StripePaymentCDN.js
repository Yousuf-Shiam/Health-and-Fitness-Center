import { useLocation, useNavigate } from 'react-router-dom';

// Load Stripe.js from CDN
const loadStripeFromCDN = () => {
    return new Promise((resolve) => {
        if (window.Stripe) {
            resolve(window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5'));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
            resolve(window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5'));
        };
        document.head.appendChild(script);
    });
};

const StripePaymentCDN = () => {
    const [stripe, setStripe] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Get payment data from navigation state or use defaults
    const paymentData = location.state || {
        amount: 100, // Default $100
        programName: 'Health & Fitness Program',
        trainerId: 'default',
        clientName: 'Customer'
    };

    // Load Stripe on component mount
    useEffect(() => {
        loadStripeFromCDN().then(setStripe);
    }, []);

    const createPaymentIntent = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            console.log('🚀 Creating payment intent for:', {
                amount: paymentData.amount,
                programName: paymentData.programName,
                userId: user.id
            });

            const response = await fetch('http://localhost:5000/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: paymentData.amount,
                    programId: paymentData.programId || 'default',
                    clientId: user.id || 'guest',
                    programName: paymentData.programName,
                    currency: 'usd'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create payment intent');
            }

            const data = await response.json();
            setClientSecret(data.clientSecret);
            setPaymentIntentId(data.paymentIntentId);

            console.log('✅ Payment intent created:', data.paymentIntentId);

        } catch (error) {
            console.error('❌ Error creating payment intent:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!stripe || !clientSecret) {
            return;
        }

        setProcessing(true);
        setError('');

        // Get payment element
        const elements = stripe.elements({
            clientSecret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#0f5132',
                }
            }
        });

        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

        // Confirm payment
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
            redirect: 'if_required'
        });

        if (paymentError) {
            setError(paymentError.message);
            console.error('❌ Payment failed:', paymentError);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log('🎉 Payment succeeded!', paymentIntent.id);
            
            // Navigate to success page
            navigate('/payment-success', {
                state: {
                    paymentIntent,
                    programName: paymentData.programName,
                    amount: paymentData.amount
                }
            });
        }

        setProcessing(false);
    };

    // Start payment intent creation on mount
    useEffect(() => {
        if (stripe && !clientSecret) {
            createPaymentIntent();
        }
    }, [stripe]);

    if (!stripe) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Loading Stripe...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Complete Your Payment</h2>
                    <div style={styles.paymentInfo}>
                        <div style={styles.amount}>${paymentData.amount}</div>
                        <div style={styles.programName}>{paymentData.programName}</div>
                    </div>
                </div>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <p>Setting up payment...</p>
                    </div>
                ) : clientSecret ? (
                    <form onSubmit={handlePayment}>
                        <div id="payment-element" style={{ marginBottom: '20px' }}></div>
                        
                        <button
                            type="submit"
                            disabled={processing || !stripe}
                            style={{
                                ...styles.payButton,
                                ...(processing ? styles.payButtonDisabled : {})
                            }}
                        >
                            {processing ? (
                                <div style={styles.loadingContainer}>
                                    <div style={styles.smallSpinner}></div>
                                    Processing...
                                </div>
                            ) : (
                                `Pay $${paymentData.amount}`
                            )}
                        </button>
                    </form>
                ) : (
                    <button onClick={createPaymentIntent} style={styles.retryButton}>
                        Try Again
                    </button>
                )}

                <div style={styles.footer}>
                    <div style={styles.secureText}>🔒 Secured by Stripe</div>
                    <div style={styles.secureSubtext}>
                        Your payment information is encrypted and secure
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '1rem',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e0e0e0',
    },
    title: {
        color: '#0f5132',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: '0 0 1rem 0',
    },
    paymentInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    amount: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#0f5132',
    },
    programName: {
        fontSize: '1rem',
        color: '#6c757d',
        fontWeight: '500',
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
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
    smallSpinner: {
        width: '20px',
        height: '20px',
        border: '2px solid #ffffff',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid #f5c6cb',
    },
    payButton: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#0f5132',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    payButtonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    retryButton: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#dc3545',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e0e0e0',
    },
    secureText: {
        color: '#0f5132',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
    },
    secureSubtext: {
        color: '#6c757d',
        fontSize: '0.85rem',
    },
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default StripePaymentCDN;
