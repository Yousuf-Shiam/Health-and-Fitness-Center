import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');

const StripeContext = createContext();

export const useStripe = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within a StripeProvider');
    }
    return context;
};

export const StripeProvider = ({ children }) => {
    const [stripe, setStripe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        stripePromise.then((stripeInstance) => {
            setStripe(stripeInstance);
            setLoading(false);
        }).catch((error) => {
            console.error('Failed to load Stripe:', error);
            setLoading(false);
        });
    }, []);

    const value = {
        stripe,
        loading,
        stripePromise
    };

    return (
        <StripeContext.Provider value={value}>
            {children}
        </StripeContext.Provider>
    );
};

export default StripeContext;
