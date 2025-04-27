import React, { useState } from 'react';
import { createMealPlan } from '../../services/api'; // Import API function

function CreateMealPlan() {
  const [formData, setFormData] = useState({
    weight: '',
    fitnessGoal: '',
    preferences: '',
  });
  const [mealPlan, setMealPlan] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createMealPlan(formData);
      setMealPlan(response.data); // Display the generated meal plan
    } catch (error) {
      console.error('Error creating meal plan:', error);
    }
  };

  return (
    <div>
      <h1>Create Your Meal Plan</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Fitness Goal:
          <select
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        <label>
          Preferences (e.g., vegetarian, keto):
          <input
            type="text"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Generate Meal Plan</button>
      </form>
      {mealPlan && (
        <div>
          <h2>Your Meal Plan</h2>
          <pre>{JSON.stringify(mealPlan, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CreateMealPlan;