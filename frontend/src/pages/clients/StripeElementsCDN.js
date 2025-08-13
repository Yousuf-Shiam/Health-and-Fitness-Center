import React, { useState, useEffect, useRef } from 'react';

const StripeElementsCDN = ({ clientSecret, onPaymentSuccess, onPaymentError, amount, programName }) => {
    const [stripe, setStripe] = useState(null);
    const [elements, setElements] = useState(null);
    const [paymentElement, setPaymentElement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const paymentElementRef = useRef(null);
    const stripeInitialized = useRef(false);
    const elementsInitialized = useRef(false);

    // Load Stripe.js from CDN
    useEffect(() => {
        if (stripeInitialized.current) return;

        const loadStripe = () => {
            if (window.Stripe) {
                const stripeInstance = window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5');
                setStripe(stripeInstance);
                stripeInitialized.current = true;
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = () => {
                const stripeInstance = window.Stripe('pk_test_51RL6ZmQw8w3Z7lbT31wZYJAVuTXRN8WyQR75svxAexrdpKHvOzAOvDEtQr9ezjD7Rm4BH4VnlCE4aYB31GoopPzY00sbskBJG5');
                setStripe(stripeInstance);
                stripeInitialized.current = true;
            };
            document.head.appendChild(script);
        };

        loadStripe();
    }, []);

    // Create Elements when Stripe loads and clientSecret is available
    useEffect(() => {
        if (stripe && clientSecret && !elementsInitialized.current) {
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
            elementsInitialized.current = true;
        }
    }, [stripe, clientSecret]);

    // Mount Payment Element when everything is ready
    useEffect(() => {
        if (elements && paymentElementRef.current && !paymentElement) {
            try {
                const element = elements.create('payment', {
                    layout: 'tabs',
                    paymentMethodOrder: ['card', 'google_pay', 'apple_pay'],
                });

                element.mount(paymentElementRef.current);
                setPaymentElement(element);
            } catch (error) {
                console.error('Error creating payment element:', error);
                setError('Failed to load payment form. Please refresh the page.');
            }
        }

        // Cleanup function
        return () => {
            if (paymentElement) {
                try {
                    paymentElement.unmount();
                } catch (error) {
                    // Element might already be unmounted
                }
                setPaymentElement(null);
            }
        };
    }, [elements, paymentElement]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Payment system is still loading. Please wait a moment.');
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
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onPaymentSuccess(paymentIntent);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred. Please try again.');
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

    if (!clientSecret) {
        return (
            <div style={styles.errorContainer}>
                <p>Setting up payment... Please wait.</p>
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
                <div ref={paymentElementRef} style={styles.paymentElement} />
            </div>

            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading || !paymentElement}
                style={{
                    ...styles.submitButton,
                    ...(loading || !paymentElement ? styles.submitButtonDisabled : {})
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
        minHeight: '50px',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    errorContainer: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
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

// Add CSS for spinner animation if not already added
if (!document.querySelector('#stripe-spinner-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'stripe-spinner-styles';
    styleSheet.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default StripeElementsCDN;
