import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Payment = () => {
    const { bookingId } = useParams(); // Assuming bookingId is passed as a route parameter
    const [paymentDetails, setPaymentDetails] = useState({
        clientName: '',
        serviceName: '',
        amount: '',
        email: '',
        fitnessGoals: '',
        preferences: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch booking and user details when the component loads
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                // Fetch booking details
                const bookingResponse = await axios.get(`/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { clientName, serviceName, amount } = bookingResponse.data;

                // Fetch user details
                const userResponse = await axios.get(`/api/users/${bookingResponse.data.clientId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { email, fitnessGoals, preferences } = userResponse.data;

                setPaymentDetails({
                    clientName,
                    serviceName,
                    amount,
                    email,
                    fitnessGoals,
                    preferences,
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch payment details');
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [bookingId]);
    

    const handlePayNow = async () => {
        try {
            const response = await axios.post(
                '/api/payments/generate-receipt',
                {
                    bookingId,
                    clientName: paymentDetails.clientName,
                    serviceName: paymentDetails.serviceName,
                    amount: paymentDetails.amount,
                },
                {
                    responseType: 'blob', // To handle the PDF file
                }
            );

            // Trigger file download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt-${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to process payment');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const styles = {
        form: {
            maxWidth: '500px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        input: {
            width: '100%',
            marginBottom: '1rem',
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
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
    };

    return (
        <form style={styles.form}>
            <h2>Payment Details</h2>
            <input type="text" value={paymentDetails.clientName} readOnly style={styles.input} />
            <input type="text" value={paymentDetails.email} readOnly style={styles.input} />
            <input type="text" value={paymentDetails.serviceName} readOnly style={styles.input} />
            <input type="text" value={`$${paymentDetails.amount}`} readOnly style={styles.input} />
            <input type="text" value={paymentDetails.fitnessGoals} readOnly style={styles.input} />
            <input type="text" value={paymentDetails.preferences} readOnly style={styles.input} />
            <button type="button" onClick={handlePayNow} style={styles.button}>
                Pay Now
            </button>
        </form>
    );
};

export default Payment;