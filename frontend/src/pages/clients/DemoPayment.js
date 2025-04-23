import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DemoPayment = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const styles = {
        container: {
            maxWidth: '500px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
        },
        heading: {
            fontSize: '1.5rem',
            marginBottom: '1rem',
        },
        message: {
            fontSize: '1rem',
            marginBottom: '1.5rem',
        },
        button: {
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundColor: '#0f5132',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    const handlePayment = () => {
        alert('Payment Successful!');
        navigate('/client-home'); // Redirect to client home page
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Demo Payment Page</h2>
            <p style={styles.message}>This is a demo payment page. Payment processing is not implemented.</p>
            <button style={styles.button} onClick={handlePayment}>
                Complete Payment
            </button>
        </div>
    );
};

export default DemoPayment;