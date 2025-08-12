import React, { useState, useEffect, useRef } from 'react';

const StripeElementsFixed = ({ clientSecret, onPaymentSuccess, onPaymentError, amount, programName }) => {
    const [stripe, setStripe] = useState(null);
    const [elements, setElements] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const paymentElementRef = useRef(null);
    const mountedRef = useRef(false);
    const elementsRef = useRef(null);

    // Load Stripe.js from CDN (only once)
    useEffect(() => {
        if (window.Stripe) {
            setStripe(window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5'));
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
            setStripe(window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5'));
        };
        script.onerror = () => {
            setError('Failed to load Stripe. Please refresh the page.');
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // Initialize elements and mount payment element
    useEffect(() => {
        if (!stripe || !clientSecret || mountedRef.current) return;

        const initializePayment = async () => {
            try {
                // Create elements instance
                const elementsInstance = stripe.elements({
                    clientSecret,
                    appearance: {
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
                    },
                });

                setElements(elementsInstance);
                elementsRef.current = elementsInstance;

                // Create and mount payment element
                const paymentElement = elementsInstance.create('payment', {
                    layout: 'tabs',
                    paymentMethodOrder: ['card', 'google_pay', 'apple_pay'],
                });

                if (paymentElementRef.current) {
                    await paymentElement.mount(paymentElementRef.current);
                    mountedRef.current = true;
                }
            } catch (error) {
                console.error('Error initializing payment:', error);
                setError('Failed to initialize payment form. Please refresh the page.');
            }
        };

        initializePayment();

        // Cleanup function
        return () => {
            mountedRef.current = false;
        };
    }, [stripe, clientSecret]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !mountedRef.current) {
            setError('Payment form is not ready. Please wait and try again.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
                redirect: 'if_required',
            });

            if (paymentError) {
                setError(paymentError.message);
                onPaymentError(paymentError);
            } else if (paymentIntent?.status === 'succeeded') {
                onPaymentSuccess(paymentIntent);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Payment failed. Please try again.');
            onPaymentError(err);
        } finally {
            setLoading(false);
        }
    };

    if (!stripe) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading secure payment form...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.headerSection}>
                <h3 style={styles.title}>Complete Your Payment</h3>
                <div style={styles.amountDisplay}>
                    <span style={styles.amount}>${amount}</span>
                    <span style={styles.programName}>{programName}</span>
                </div>
            </div>

            <div style={styles.paymentSection}>
                <div ref={paymentElementRef} style={styles.paymentElement}></div>
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading || !mountedRef.current}
                style={{
                    ...styles.submitButton,
                    ...((loading || !mountedRef.current) ? styles.submitButtonDisabled : {})
                }}
            >
                {loading ? (
                    <div style={styles.loadingButtonContainer}>
                        <div style={styles.smallSpinner}></div>
                        Processing...
                    </div>
                ) : (
                    `Pay $${amount}`
                )}
            </button>

            <div style={styles.securityInfo}>
                <div style={styles.securityBadge}>
                    <span style={styles.lockIcon}>🔒</span>
                    <span>Secured by Stripe</span>
                </div>
                <div style={styles.securityText}>
                    Your payment information is encrypted and secure
                </div>
            </div>
        </form>
    );
};

const styles = {
    form: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
    },
    headerSection: {
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
    amountDisplay: {
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
    paymentSection: {
        marginBottom: '1.5rem',
    },
    paymentElement: {
        minHeight: '40px',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '0.75rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        border: '1px solid #f5c6cb',
        fontSize: '0.9rem',
    },
    submitButton: {
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
        marginBottom: '1rem',
    },
    submitButtonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
    },
    loadingButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    securityInfo: {
        textAlign: 'center',
        color: '#6c757d',
    },
    securityBadge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
    },
    lockIcon: {
        fontSize: '1rem',
    },
    securityText: {
        fontSize: '0.8rem',
        lineHeight: '1.4',
    },
};

// Add CSS for animations
if (!document.querySelector('#stripe-animations')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'stripe-animations';
    styleSheet.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default StripeElementsFixed;
