import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MealComponent = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [newMeal, setNewMeal] = useState({ name: '', calories: '', dietaryPreference: '' });

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            const response = await axios.get('/api/meals');
            setMealPlans(response.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeal({ ...newMeal, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/meals', newMeal);
            fetchMealPlans();
            setNewMeal({ name: '', calories: '', dietaryPreference: '' });
        } catch (error) {
            console.error('Error adding meal:', error);
        }
    };

    return (
        <div>
            <h2>Meal Planning</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Meal Name"
                    value={newMeal.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={newMeal.calories}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="dietaryPreference"
                    placeholder="Dietary Preference"
                    value={newMeal.dietaryPreference}
                    onChange={handleInputChange}
                />
                <button type="submit">Add Meal</button>
            </form>
            <ul>
                {mealPlans.map((meal) => (
                    <li key={meal._id}>
                        {meal.name} - {meal.calories} calories ({meal.dietaryPreference})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MealComponent;