import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Import useParams

const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Get location state
    const { bookingId } = useParams(); // Get bookingId from URL
    
    console.log('💰 Payment component loaded with booking ID:', bookingId);
    console.log('💰 Payment location state:', location.state);
    
    // Get payment data passed from BookedPrograms
    const paymentData = location.state || {
        amount: 100,
        programName: 'Health & Fitness Program',
        programId: 'demo-program',
        clientName: 'Client',
        description: 'Payment for fitness program'
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }
        console.log(`Proceeding with payment method: ${selectedPaymentMethod}`);
        console.log('💳 Payment data received:', paymentData); // Debug log
        console.log('🔍 Booking ID from URL:', bookingId); // Debug log
        
        // Route to different payment processors based on selection
        if (selectedPaymentMethod === 'stripe') {
            navigate(`/stripe-payment/${bookingId}`, {
                state: paymentData // Pass the real payment data instead of hardcoded values
            });
        } else {
            // Navigate to the demo payment page for other methods
            navigate('/demo-payment');
        }
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
            textAlign: 'left',
            backgroundColor: '#f9f9f9',
            transition: 'all 0.3s ease',
        },
        selectedOption: {
            borderColor: '#0f5132',
            backgroundColor: '#e8f5e8',
        },
        methodDescription: {
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: '#0f5132',
            lineHeight: '1.4',
        },
    };

    return (
        <form style={styles.form} onSubmit={handleSubmit}>
            <h2>Choose Payment Method</h2>
            
            {/* Stripe Payment Option */}
            <div style={{...styles.option, ...(selectedPaymentMethod === 'stripe' ? styles.selectedOption : {})}}>
                <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="stripe"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="stripe" style={{ marginLeft: '0.5rem' }}>
                    💳 <strong>Stripe</strong> - Credit/Debit Card (Secure)
                </label>
                {selectedPaymentMethod === 'stripe' && (
                    <p style={styles.methodDescription}>
                        ✅ Most secure payment method<br/>
                        ✅ Instant processing<br/>
                        ✅ All major cards accepted
                    </p>
                )}
            </div>
            
            <div style={{...styles.option, ...(selectedPaymentMethod === 'card' ? styles.selectedOption : {})}}>
                <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label htmlFor="card" style={{ marginLeft: '0.5rem' }}>
                    Credit/Debit Card (Demo)
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