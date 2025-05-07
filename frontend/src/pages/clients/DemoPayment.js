import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jsPDF } from 'jspdf'; // Import jsPDF

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
        // Generate the receipt
        const doc = new jsPDF();

        // Add receipt content
        doc.setFontSize(16);
        doc.text('Payment Receipt', 20, 20);

        doc.setFontSize(12);
        doc.text('Booking Information:', 20, 40);
        doc.text('Program Name: Personal Training', 20, 50);
        doc.text('Trainer: John Doe', 20, 60);
        doc.text('Duration: 12 weeks', 20, 70);

        doc.text('Payment Information:', 20, 90);
        doc.text('Payment Method: Credit/Debit Card', 20, 100);
        doc.text('Amount Paid: $200', 20, 110);

        doc.text('Client Information:', 20, 130);
        doc.text('Client Name: Jane Smith', 20, 140);
        doc.text('Email: jane.smith@example.com', 20, 150);

        // Save the PDF
        doc.save('payment-receipt.pdf');

        // Show success message and navigate back to client home
        alert('Payment Successful! Receipt has been downloaded.');
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