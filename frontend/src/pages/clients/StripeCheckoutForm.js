import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ 
    clientSecret, 
    onPaymentSuccess, 
    onPaymentError, 
    amount, 
    programName 
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        setIsLoading(true);
        setMessage(null);

        console.log('🔄 Processing payment...');

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`.
            console.error('❌ Payment error:', error);
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment succeeded
            console.log('🎉 Payment succeeded:', paymentIntent.id);
            onPaymentSuccess(paymentIntent);
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    };

    return (
        <div style={styles.formContainer}>
            <form id="payment-form" onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.paymentElement}>
                    <PaymentElement 
                        id="payment-element" 
                        options={paymentElementOptions} 
                    />
                </div>
                
                {message && (
                    <div style={styles.message} id="payment-message">
                        ⚠️ {message}
                    </div>
                )}
                
                <button 
                    disabled={isLoading || !stripe || !elements} 
                    id="submit" 
                    style={{
                        ...styles.submitButton,
                        ...(isLoading ? styles.submitButtonDisabled : {})
                    }}
                >
                    <span id="button-text">
                        {isLoading ? (
                            <div style={styles.spinnerContainer}>
                                <div style={styles.spinner}></div>
                                Processing...
                            </div>
                        ) : (
                            `Pay $${amount} Now`
                        )}
                    </span>
                </button>
            </form>

            <div style={styles.paymentInfo}>
                <h4 style={styles.infoTitle}>Payment Details</h4>
                <div style={styles.infoItem}>
                    <span>Program:</span>
                    <strong>{programName}</strong>
                </div>
                <div style={styles.infoItem}>
                    <span>Amount:</span>
                    <strong>${amount}</strong>
                </div>
                <div style={styles.infoItem}>
                    <span>Payment Method:</span>
                    <strong>Credit/Debit Card</strong>
                </div>
            </div>

            <div style={styles.securityInfo}>
                <p style={styles.securityText}>
                    🔒 <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
                    We use Stripe, trusted by millions of businesses worldwide.
                </p>
                <div style={styles.badges}>
                    <span style={styles.badge}>🛡️ SSL Encrypted</span>
                    <span style={styles.badge}>💳 PCI Compliant</span>
                    <span style={styles.badge}>🔐 256-bit Security</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    formContainer: {
        padding: '2rem',
    },
    form: {
        marginBottom: '2rem',
    },
    paymentElement: {
        marginBottom: '1.5rem',
    },
    message: {
        color: '#df1b41',
        fontSize: '14px',
        marginBottom: '1rem',
        padding: '0.8rem',
        backgroundColor: '#ffeaea',
        border: '1px solid #df1b41',
        borderRadius: '4px',
        textAlign: 'center',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#0f5132',
        color: '#ffffff',
        border: 'none',
        padding: '1rem',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(15, 81, 50, 0.2)',
    },
    submitButtonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
        opacity: 0.6,
    },
    spinnerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid #ffffff',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    paymentInfo: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid #e9ecef',
    },
    infoTitle: {
        margin: '0 0 1rem 0',
        color: '#0f5132',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        fontSize: '0.95rem',
    },
    securityInfo: {
        textAlign: 'center',
        marginTop: '1.5rem',
    },
    securityText: {
        fontSize: '0.85rem',
        color: '#6c757d',
        lineHeight: '1.4',
        margin: '0 0 1rem 0',
    },
    badges: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    badge: {
        fontSize: '0.75rem',
        color: '#0f5132',
        backgroundColor: '#e8f5e8',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        border: '1px solid #0f5132',
    },
};

export default StripeCheckoutForm;
