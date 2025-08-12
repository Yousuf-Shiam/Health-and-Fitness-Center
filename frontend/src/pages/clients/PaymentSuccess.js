import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    const paymentData = location.state || {};
    const { paymentIntent, programName, amount } = paymentData;

    useEffect(() => {
        // Redirect countdown
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/client-home');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleDownloadReceipt = () => {
        // Create a simple receipt download
        const receiptData = `
PAYMENT RECEIPT
==============

Transaction ID: ${paymentIntent?.id || 'N/A'}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Program: ${programName || 'Health & Fitness Program'}
Amount: $${amount || '0.00'}
Payment Method: Credit Card
Status: PAID

Thank you for your payment!

Health & Fitness Center
Contact: support@healthfitness.com
`;

        const blob = new Blob([receiptData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${paymentIntent?.id || Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.successCard}>
                {/* Success Animation */}
                <div style={styles.successIcon}>
                    <div style={styles.checkmark}>✓</div>
                </div>

                {/* Success Message */}
                <h1 style={styles.title}>🎉 Payment Successful!</h1>
                <p style={styles.subtitle}>
                    Your payment has been processed successfully
                </p>

                {/* Payment Details */}
                <div style={styles.detailsCard}>
                    <h3 style={styles.detailsTitle}>Payment Details</h3>
                    <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Transaction ID:</span>
                            <span style={styles.value}>
                                {paymentIntent?.id ? 
                                    `...${paymentIntent.id.slice(-8)}` : 
                                    'N/A'
                                }
                            </span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Program:</span>
                            <span style={styles.value}>{programName || 'Health Program'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Amount Paid:</span>
                            <span style={styles.value}>${amount || '0.00'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Date & Time:</span>
                            <span style={styles.value}>{formatDate()}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Payment Method:</span>
                            <span style={styles.value}>Credit Card</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Status:</span>
                            <span style={{...styles.value, ...styles.statusPaid}}>PAID</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                    <button 
                        style={styles.downloadButton}
                        onClick={handleDownloadReceipt}
                    >
                        📄 Download Receipt
                    </button>
                    <button 
                        style={styles.homeButton}
                        onClick={() => navigate('/client-home')}
                    >
                        🏠 Go to Dashboard
                    </button>
                </div>

                {/* Next Steps */}
                <div style={styles.nextSteps}>
                    <h4 style={styles.nextStepsTitle}>What's Next?</h4>
                    <ul style={styles.stepsList}>
                        <li>✅ You will receive a confirmation email shortly</li>
                        <li>📅 Your program access has been activated</li>
                        <li>👨‍💼 A trainer will contact you within 24 hours</li>
                        <li>📱 Check your dashboard for program updates</li>
                    </ul>
                </div>

                {/* Auto Redirect Notice */}
                <div style={styles.redirectNotice}>
                    <p>
                        Redirecting to dashboard in <strong>{countdown}</strong> seconds...
                    </p>
                    <div style={styles.progressBar}>
                        <div 
                            style={{
                                ...styles.progressFill,
                                width: `${((10 - countdown) / 10) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Support */}
            <div style={styles.supportCard}>
                <h4>Need Help? 🤝</h4>
                <p>
                    If you have any questions about your payment or program, 
                    our support team is here to help.
                </p>
                <p>
                    📧 Email: support@healthfitness.com<br/>
                    📞 Phone: (555) 123-4567
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successCard: {
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '2rem',
        border: '3px solid #28a745',
    },
    successIcon: {
        marginBottom: '2rem',
    },
    checkmark: {
        width: '80px',
        height: '80px',
        backgroundColor: '#28a745',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        color: '#ffffff',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(40, 167, 69, 0.3)',
    },
    title: {
        color: '#28a745',
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#6c757d',
        fontSize: '1.2rem',
        marginBottom: '2rem',
    },
    detailsCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    detailsTitle: {
        color: '#0f5132',
        fontSize: '1.3rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    detailsGrid: {
        display: 'grid',
        gap: '1rem',
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 0',
        borderBottom: '1px solid #e9ecef',
    },
    label: {
        fontWeight: '600',
        color: '#495057',
    },
    value: {
        color: '#212529',
        fontWeight: '500',
    },
    statusPaid: {
        color: '#28a745',
        fontWeight: 'bold',
        backgroundColor: '#d4edda',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.9rem',
    },
    actionButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    downloadButton: {
        backgroundColor: '#6f42c1',
        color: '#ffffff',
        border: 'none',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(111, 66, 193, 0.3)',
    },
    homeButton: {
        backgroundColor: '#0f5132',
        color: '#ffffff',
        border: 'none',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(15, 81, 50, 0.3)',
    },
    nextSteps: {
        backgroundColor: '#e8f5e8',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'left',
    },
    nextStepsTitle: {
        color: '#0f5132',
        fontSize: '1.2rem',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    stepsList: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
    },
    redirectNotice: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '0.95rem',
    },
    progressBar: {
        width: '100%',
        height: '4px',
        backgroundColor: '#e9ecef',
        borderRadius: '2px',
        marginTop: '0.5rem',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0f5132',
        transition: 'width 1s linear',
    },
    supportCard: {
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        color: '#6c757d',
    },
};

export default PaymentSuccess;
