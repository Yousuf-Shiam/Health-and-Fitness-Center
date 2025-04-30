import React, { useEffect, useState } from 'react';
import NutritionistNavBar from './NutritionistNavBar';
import Footer from '../../components/Footer';
import { getAssignedMealPlans, updateMealPlan, updateApprovalStatus } from '../../services/api';

function MealPlanReview() {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [updatedMealPlan, setUpdatedMealPlan] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

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
    link: {
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      textAlign: 'left',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    modalClient: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        textAlign: 'left',
        width: '45%',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 1001,
    },
    modalHeader: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    modalSection: {
      marginBottom: '1.5rem',
    },
    modalButton: {
      backgroundColor: '#0f5132',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      marginRight: '10px',
    },
    modalButtonAdd: {
        backgroundColor: 'rgb(15, 51, 81)',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        marginRight: '10px',
       
      },
    cancelButton: {
      backgroundColor: 'rgb(110, 16, 13)',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
        marginRight: '10px',
    },
    removeButton: {
      backgroundColor: 'rgb(120, 21, 66)',
      color: '#fff',
      padding: '5px 5px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
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

  const handleAddMeal = () => {
    const newMeal = { meal: '', items: [] };
    setUpdatedMealPlan({
      ...updatedMealPlan,
      mealPlan: [...updatedMealPlan.mealPlan, newMeal],
    });
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = updatedMealPlan.mealPlan.filter((_, i) => i !== index);
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

  const handleViewClientDetails = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  return (
    <>
      <div style={styles.container}>
        <NutritionistNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Assigned Meal Plans</h1>
          <div style={styles.section}>
            {selectedMealPlan ? (
              <div style={styles.modal}>
                <h2 style={styles.modalHeader}>Review Meal Plan</h2>
                <div style={styles.modalSection}>
                  <p><strong>Name:</strong> {selectedMealPlan.name}</p>
                    <p><strong>Approval Status:</strong> {selectedMealPlan.approvalStatus}</p>
                  <p><strong>Description:</strong> {selectedMealPlan.description}</p>
                  <p><strong>Fitness Goal:</strong> {selectedMealPlan.fitnessGoal}</p>
                  <p><strong>Preferences:</strong> {selectedMealPlan.preferences || 'None'}</p>
                  <p>
                    <strong>Client:</strong>{' '}
                    <span
                      style={styles.link}
                      onClick={() => handleViewClientDetails(selectedMealPlan.creator)}
                    >
                      {selectedMealPlan.creator.name}
                    </span>
                  </p>
                </div>
                <div style={styles.modalSection}>
                  <h3 style={{textAlign : "center", marginTop: "7%", backgroundColor: 'rgb(216, 255, 215)' }}>Meals</h3>
                  {updatedMealPlan.mealPlan.map((meal, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0rem' }}>
                      {/* Left Section: Meal Name */}
                      <div style={{ flex: 1, marginRight: '1rem' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>Meal Name:</label>
                        <input
                          type="text"
                          value={meal.meal}
                          onChange={(e) => handleUpdateMealPlan(index, 'meal', e.target.value)}
                          style={styles.textarea}
                        />
                      </div>

                      {/* Right Section: Meal Items */}
                      <div style={{ flex: 2 }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>Meal Items:</label>
                        <textarea
                          value={meal.items.join(', ')}
                          onChange={(e) =>
                            handleUpdateMealPlan(index, 'items', e.target.value.split(',').map((item) => item.trim()))
                          }
                          style={styles.textarea}
                        />
                      </div>

                      {/* Remove Meal Button */}
                      <button
                        style={{ ...styles.removeButton, marginLeft: '1rem', alignSelf: 'center' }}
                        onClick={() => handleRemoveMeal(index)}
                      >
                        Remove Meal
                      </button>
                    </div>
                  ))}
                  <button style={{...styles.modalButtonAdd, marginLeft : "45%", marginBottom : "3%"}} onClick={handleAddMeal}>
                    Add Meal
                  </button>
                </div>

                <div style = {{display: 'flex', justifyContent: 'center'}}>
                <button
                  style={styles.modalButton}
                  onClick={handleSaveMealPlan}
                >
                  Save Changes
                </button>
                <button
                  style={styles.modalButton}
                  onClick={() => handleApproval('approved')}
                >
                  Approve
                </button>
                <button
                  style={styles.cancelButton}
                  onClick={() => handleApproval('rejected')}
                >
                  Reject
                </button>
                <button
                  style={styles.cancelButton}
                  onClick={() => {
                    setSelectedMealPlan(null);
                    setUpdatedMealPlan(null);
                  }}
                >
                  Cancel
                </button>
                </div>
              </div>
            ) : (
              mealPlans
                .filter((plan) => plan.approvalStatus !== 'rejected') // Filter out rejected meal plans
                .map((plan, index) => (
                  <div key={index} style={styles.item}>
                    <h3>{plan.name}</h3>
                      <p><strong>Approval Status:</strong> {plan.approvalStatus}</p>
                    <p><strong>Description:</strong> {plan.description}</p>
                    <p><strong>Fitness Goal:</strong> {plan.fitnessGoal}</p>
                    <p><strong>Preferences:</strong> {plan.preferences || 'None'}</p>
                    <p>
                      <strong>Client:</strong>{' '}
                      <span
                        style={styles.link}
                        onClick={() => handleViewClientDetails(plan.creator)}
                      >
                        {plan.creator.name}
                      </span>
                    </p>
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

      {isClientModalOpen && selectedClient && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalClient}>
            <h3>Client Details</h3>
            <p><strong>Name:</strong> {selectedClient.name}</p>
            <p><strong>Email:</strong> {selectedClient.email}</p>
            <p><strong>Weight:</strong> {selectedClient.weight || 'N/A'}</p>
            <p><strong>Fitness Goal:</strong> {selectedClient.fitnessGoal || 'N/A'}</p>
            <button
              style={styles.modalButton}
              onClick={() => setIsClientModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default MealPlanReview;