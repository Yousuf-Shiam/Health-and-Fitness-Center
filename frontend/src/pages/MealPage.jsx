import React, { useState, useEffect } from 'react';
import MealComponent from '../components/MealPlanning/MealComponent';
import { getMealPlans } from '../utils/api';

const MealPage = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMealPlans = async () => {
            try {
                const data = await getMealPlans();
                setMealPlans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Meal Planning</h1>
            {mealPlans.length > 0 ? (
                mealPlans.map((mealPlan) => (
                    <MealComponent key={mealPlan.id} mealPlan={mealPlan} />
                ))
            ) : (
                <p>No meal plans available.</p>
            )}
        </div>
    );
};

export default MealPage;