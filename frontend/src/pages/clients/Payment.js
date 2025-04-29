import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }
        console.log(`Proceeding with payment method: ${selectedPaymentMethod}`);
        // Navigate to the demo payment page
        navigate('/demo-payment'); // Replace '/demo-payment' with the actual route for the demo payment page
    };

    const styles = {
        form: {
            maxWidth: '500px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        button: {
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#0f5132',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        option: {
            marginBottom: '1rem',
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
        },
    };

    return (
        <form style={styles.form} onSubmit={handleSubmit}>
            <h2>Choose Payment Method</h2>
            <div style={styles.option}>
                <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="card" style={{ marginLeft: '0.5rem' }}>
                    Credit/Debit Card
                </label>
            </div>
            <div style={styles.option}>
                <input
                    type="radio"
                    id="mobileBanking"
                    name="paymentMethod"
                    value="mobileBanking"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="mobileBanking" style={{ marginLeft: '0.5rem' }}>
                    Mobile Banking
                </label>
            </div>
            <div style={styles.option}>
                <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="upi" style={{ marginLeft: '0.5rem' }}>
                    UPI
                </label>
            </div>
            <button type="submit" style={styles.button}>
                Proceed to Pay
            </button>
        </form>
    );
};

export default Payment;