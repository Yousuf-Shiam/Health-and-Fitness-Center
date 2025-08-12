// Temporary demo checkout form to replace Stripe Elements
import React from 'react';

const StripeCheckoutForm = ({ clientSecret, onPaymentSuccess, onPaymentError, amount, programName }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '8px' }}>
            <h3>Stripe Checkout Form (Demo)</h3>
            <p>This is a temporary placeholder while Stripe packages are being installed.</p>
            <p>Amount: ${amount}</p>
            <p>Program: {programName}</p>
            <button 
                onClick={() => onPaymentSuccess({ id: 'demo_' + Date.now(), amount: amount * 100 })}
                style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
            >
                Demo Payment - ${amount}
            </button>
        </div>
    );
};

export default StripeCheckoutForm;
