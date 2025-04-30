import React, { useEffect, useState } from 'react';
import NutritionistNavBar from './NutritionistNavBar';
import Footer from '../../components/Footer';
import { getAssignedMealPlans, updateMealPlan, updateApprovalStatus } from '../../services/api';

function MealPlanReview() {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [updatedMealPlan, setUpdatedMealPlan] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      margin: 0,
      padding: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: 'rgb(10, 53, 99)',
      marginBottom: '1rem',
    },
    section: {
      margin: '2rem 0',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
    },
    item: {
      marginBottom: '1rem',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      textAlign: 'left',
    },
    button: {
      backgroundColor: '#0f5132',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    textarea: {
      width: '100%',
      height: '100px',
      marginBottom: '1rem',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
  };

  useEffect(() => {
    const fetchAssignedMealPlans = async () => {
      try {
        const response = await getAssignedMealPlans(); // Fetch meal plans assigned to the logged-in nutritionist
        setMealPlans(response.data);
      } catch (error) {
        console.error('Error fetching assigned meal plans:', error);
      }
    };

    fetchAssignedMealPlans();
  }, []);

  const handleSelectMealPlan = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setUpdatedMealPlan({ ...mealPlan });
  };

  const handleUpdateMealPlan = (index, field, value) => {
    const updatedMeals = [...updatedMealPlan.mealPlan];
    updatedMeals[index][field] = value;
    setUpdatedMealPlan({ ...updatedMealPlan, mealPlan: updatedMeals });
  };

  const handleSaveMealPlan = async () => {
    try {
      await updateMealPlan(selectedMealPlan._id, { mealPlan: updatedMealPlan.mealPlan });
      alert('Meal plan updated successfully!');
      setSelectedMealPlan(null);
      setUpdatedMealPlan(null);
      const response = await getAssignedMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    }
  };

  const handleApproval = async (approvalStatus) => {
    try {
      await updateApprovalStatus(selectedMealPlan._id, { approvalStatus });
      alert(`Meal plan ${approvalStatus} successfully!`);
      setSelectedMealPlan(null);
      setUpdatedMealPlan(null);
      const response = await getAssignedMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error updating approval status:', error);
      alert('Failed to update approval status. Please try again.');
    }
  };

  return (
    <>
      <div style={styles.container}>
        <NutritionistNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Assigned Meal Plans</h1>
          <div style={styles.section}>
            {selectedMealPlan ? (
              <div style={styles.item}>
                <h3>{selectedMealPlan.name}</h3>
                <p><strong>Description:</strong> {selectedMealPlan.description}</p>
                <p><strong>Fitness Goal:</strong> {selectedMealPlan.fitnessGoal}</p>
                <p><strong>Preferences:</strong> {selectedMealPlan.preferences || 'None'}</p>
                <h4>Meals:</h4>
                {updatedMealPlan.mealPlan.map((meal, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={meal.meal}
                      onChange={(e) => handleUpdateMealPlan(index, 'meal', e.target.value)}
                      style={styles.textarea}
                    />
                    <textarea
                      value={meal.items.join(', ')}
                      onChange={(e) =>
                        handleUpdateMealPlan(index, 'items', e.target.value.split(',').map((item) => item.trim()))
                      }
                      style={styles.textarea}
                    />
                  </div>
                ))}
                <button
                  style={styles.button}
                  onClick={handleSaveMealPlan}
                >
                  Save Changes
                </button>
                <button
                  style={styles.button}
                  onClick={() => handleApproval('approved')}
                >
                  Approve
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: '#d9534f' }}
                  onClick={() => handleApproval('rejected')}
                >
                  Reject
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: '#6c757d' }}
                  onClick={() => {
                    setSelectedMealPlan(null);
                    setUpdatedMealPlan(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              mealPlans.map((plan, index) => (
                <div key={index} style={styles.item}>
                  <h3>{plan.name}</h3>
                  <p><strong>Description:</strong> {plan.description}</p>
                  <p><strong>Fitness Goal:</strong> {plan.fitnessGoal}</p>
                  <p><strong>Preferences:</strong> {plan.preferences || 'None'}</p>
                  <button
                    style={styles.button}
                    onClick={() => handleSelectMealPlan(plan)}
                  >
                    Review Meal Plan
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MealPlanReview;