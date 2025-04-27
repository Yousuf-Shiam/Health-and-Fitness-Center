
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMealPlans } from '../../services/api';

function Mealplan() {
  const [mealPlans, setMealPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        const response = await getMealPlans(userId);
        setMealPlans(response.data);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };

    fetchMealPlans();
  }, []);

  return (
    <div className="mealplan-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Meal Plans</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/create-meal-plan')}
          style={{
            backgroundColor: '#0f5132',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Create New Meal Plan
        </button>
      </div>
      {mealPlans.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {mealPlans.map((plan, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2 style={{ color: '#0f5132' }}>Meal Plan {index + 1}</h2>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {plan.mealPlan.map((meal, mealIndex) => (
                  <li key={mealIndex} style={{ marginBottom: '10px' }}>
                    <strong>{meal.meal}:</strong> {meal.items.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '18px' }}>
          You have not created a meal plan yet.
        </p>
      )}
    </div>
  );
}

export default Mealplan;