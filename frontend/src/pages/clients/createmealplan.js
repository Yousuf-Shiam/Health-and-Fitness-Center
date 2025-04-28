import React, { useState } from 'react';
import { createMealPlan } from '../../services/api'; // Import API function
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer'; // Import the Footer component

function CreateMealPlan() {
  const [formData, setFormData] = useState({
    weight: '',
    fitnessGoal: '',
    preferences: '',
    mealPlan: [
      { meal: 'Breakfast', items: '' },
      { meal: 'Lunch', items: '' },
      { meal: 'Dinner', items: '' },
    ],
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMealChange = (index, value) => {
    const updatedMealPlan = [...formData.mealPlan];
    updatedMealPlan[index].items = value;
    setFormData({ ...formData, mealPlan: updatedMealPlan });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Debugging form data
    try {
      const response = await createMealPlan(formData);
      console.log('API Response:', response.data); // Debugging API response
      setMessage('Meal Plan created successfully!');
      setFormData({
        weight: '',
        fitnessGoal: '',
        preferences: '',
        mealPlan: [
          { meal: 'Breakfast', items: '' },
          { meal: 'Lunch', items: '' },
          { meal: 'Dinner', items: '' },
        ],
      });
    } catch (error) {
      console.error('Error creating meal plan:', error.response || error.message);
      setMessage('Failed to create meal plan. Please try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      padding: '2rem',
    },
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
      padding: '0.8rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      marginTop: '1rem',
      fontSize: '1rem',
      color: '#333',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    subheading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#555',
    },
  };

  return (
    <>
      <ClientNavBar /> {/* Add the ClientNavBar */}
      <div style={styles.container}>
        <h1 style={styles.heading}>Create a Meal Plan</h1>
        <p style={styles.subheading}>Fill out the form below to create a personalized meal plan.</p>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            style={styles.input}
            placeholder="Weight (kg)"
            required
          />
          <select
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Fitness Goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input
            type="text"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            style={styles.input}
            placeholder="Preferences (e.g., vegetarian, keto)"
          />
          <h3 style={styles.subheading}>Meal Details</h3>
          {formData.mealPlan.map((meal, index) => (
            <div key={index}>
              <label>
                {meal.meal} Items (comma-separated):
                <input
                  type="text"
                  value={meal.items}
                  onChange={(e) => handleMealChange(index, e.target.value)}
                  style={styles.input}
                  required
                />
              </label>
            </div>
          ))}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Create Meal Plan
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
      <Footer />
    </>
  );
}

export default CreateMealPlan;