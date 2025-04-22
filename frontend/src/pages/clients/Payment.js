import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Payment = () => {
    const { bookingId } = useParams(); // Assuming bookingId is passed as a route parameter
    const [paymentDetails, setPaymentDetails] = useState({
        clientName: '',
        serviceName: '',
        amount: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch booking details when the component loads
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`/api/bookings/${bookingId}`);
                const { clientName, serviceName, amount } = response.data;
                setPaymentDetails({ clientName, serviceName, amount });
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
            const response = await axios.post('/api/payments/generate-receipt', {
                bookingId,
                clientName: paymentDetails.clientName,
                serviceName: paymentDetails.serviceName,
                amount: paymentDetails.amount,
            }, {
                responseType: 'blob', // To handle the PDF file
            });

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

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <form>
                <div>
                    <label>Booking ID:</label>
                    <input type="text" value={bookingId} readOnly />
                </div>
                <div>
                    <label>Client Name:</label>
                    <input type="text" value={paymentDetails.clientName} readOnly />
                </div>
                <div>
                    <label>Service Name:</label>
                    <input type="text" value={paymentDetails.serviceName} readOnly />
                </div>
                <div>
                    <label>Amount to Pay:</label>
                    <input type="text" value={`$${paymentDetails.amount}`} readOnly />
                </div>
                <button type="button" onClick={handlePayNow}>
                    Pay Now
                </button>
            </form>
        </div>
    );
};

export default Payment;