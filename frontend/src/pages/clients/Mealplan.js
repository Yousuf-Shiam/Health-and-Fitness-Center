import React, { useEffect, useState } from 'react';
import ClientNavBar from './ClientNavBar';
import Footer from '../../components/Footer';
import { getMealPlans, getUsers, assignNutritionist, updateApprovalStatus } from '../../services/api';
import {jwtDecode} from 'jwt-decode';

function Mealplan() {
  const [mealPlans, setMealPlans] = useState([]);
  const [clientName, setClientName] = useState('');
  const [nutritionists, setNutritionists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
  const [selectedNutritionistId, setSelectedNutritionistId] = useState(null);

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
    subheading: {
      fontSize: '1.4rem',
      color: '#555555',
      marginBottom: '2rem',
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
    sectionHeading: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
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
    modalOverlay: {
      position: 'fixed',
      overflowY: 'auto',
      overflowX: 'hidden',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      paddingTop: '3rem',
    },
    modal: {
      backgroundColor: '#fff',
      padding: '3rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '400px',
    },
    nutritionistItem: {
      borderBottom: '1px solid #ccc',
      padding: '1rem 0',
    },
    selectedNutritionist: {
      backgroundColor: '#d1e7dd',
      padding: '0.5rem',
      borderRadius: '4px',
    },
    modalButton: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#0f5132',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    cancelButton: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#d9534f',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    const fetchMealPlansAndNutritionists = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);

        const mealPlansResponse = await getMealPlans();
        setMealPlans(mealPlansResponse.data);

        const userResponse = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch client name');
        }

        const userData = await userResponse.json();
        setClientName(userData.name);

        // Fetch all nutritionists
        const nutritionistsResponse = await getUsers();
        const filteredNutritionists = nutritionistsResponse.data.filter(
          (user) => user.role === 'nutritionist'
        );
        setNutritionists(filteredNutritionists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMealPlansAndNutritionists();
  }, []);

  const handleOpenModal = (mealPlanId) => {
    setSelectedMealPlanId(mealPlanId);
    setIsModalOpen(true);
  };

  const handleAssignNutritionist = async () => {
    try {
      if (!selectedNutritionistId) {
        alert('Please select a nutritionist before confirming.');
        return;
      }
      await assignNutritionist(selectedMealPlanId, { nutritionistId: selectedNutritionistId });
      alert('Nutritionist assigned successfully!');
      setIsModalOpen(false);
      setSelectedMealPlanId(null);
      setSelectedNutritionistId(null);
      // Refresh meal plans to reflect the assigned nutritionist
      const mealPlansResponse = await getMealPlans();
      setMealPlans(mealPlansResponse.data);
    } catch (error) {
      console.error('Error assigning nutritionist:', error);
      alert('Failed to assign nutritionist. Please try again.');
    }
  };

  const handleApproval = async (mealPlanId, approvalStatus) => {
    try {
      await updateApprovalStatus(mealPlanId, { approvalStatus });
      alert(`Meal plan Re-assigned successfully!`);
      // Refresh meal plans to reflect the updated status
      const mealPlansResponse = await getMealPlans();
      setMealPlans(mealPlansResponse.data);
    } catch (error) {
      console.error('Error updating approval status:', error);
      alert('Failed to update approval status. Please try again.');
    }
  };

  return (
    <>
      <div style={styles.container}>
        <ClientNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome, {clientName}!</h1>
          <p style={styles.subheading}>Here are your created meal plans:</p>

          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Your Meal Plans</h2>
            {mealPlans.length > 0 ? (
              mealPlans.map((plan, index) => (
                <div key={index} style={styles.item}>
                  <h3>{plan.name}</h3>
                  <p><strong>Description:</strong> {plan.description}</p>
                  <p><strong>Fitness Goal:</strong> {plan.fitnessGoal}</p>
                  <p><strong>Preferences:</strong> {plan.preferences || 'None'}</p>
                  <p><strong>Meals:</strong></p>
                  <ul>
                    {plan.mealPlan.map((meal, mealIndex) => (
                      <li key={mealIndex}>
                        <strong>{meal.meal}</strong>: {meal.items.join(', ')}
                      </li>
                    ))}
                  </ul>

                  <p><strong>Approval Status:</strong> {plan.approvalStatus}</p>

                  {plan.approvalStatus === 'rejected' ? (
                    <>
                      <p style={styles.selectedNutritionist}>
                        <strong>Assigned Nutritionist:</strong> {plan.nutritionist.name}
                      </p>
                      <button
                        style={styles.button}
                        onClick={() => handleApproval(plan._id, 'pending')}
                      >
                        Reassign to {plan.nutritionist.name}
                      </button>
                      <button
                      style={{...styles.button, marginLeft: '10px' }}
                      onClick={() => handleOpenModal(plan._id)}
                    >
                      Assign New Nutritionist
                    </button>
                    </>
                  ) : plan.nutritionist && plan.approvalStatus !== 'approved' ? (
                    <>
                      <p style={styles.selectedNutritionist}>
                        <strong>Assigned Nutritionist:</strong> {plan.nutritionist.name}
                      </p>
                      <button
                        style={styles.button}
                        onClick={() => handleOpenModal(plan._id)}
                      >
                        Change Assigned Nutritionist
                      </button>
                    </>
                  ) : plan.approvalStatus === 'approved' ? (
                    <p style={styles.selectedNutritionist}>
                      <strong>Assigned Nutritionist:</strong> {plan.nutritionist.name}
                    </p>
                  ) : (
                    <button
                      style={styles.button}
                      onClick={() => handleOpenModal(plan._id)}
                    >
                      Assign Nutritionist
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#888', fontSize: '18px' }}>
                You have not created any meal plans yet.
              </p>
            )}
          </div>

          <button
            style={styles.button}
            onClick={() => (window.location.href = '/create-meal-plan')}
          >
            Create New Meal Plan
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Select a Nutritionist</h3>
            <ul>
              {nutritionists.map((nutritionist) => (
                <li
                  key={nutritionist._id}
                  style={{
                    ...styles.nutritionistItem,
                    ...(selectedNutritionistId === nutritionist._id
                      ? { backgroundColor: '#d1e7dd' }
                      : {}),
                  }}
                >
                  <p><strong>Name:</strong> {nutritionist.name}</p>
                  <p><strong>Email:</strong> {nutritionist.email}</p>
                  <button
                    style={styles.modalButton}
                    onClick={() => setSelectedNutritionistId(nutritionist._id)}
                  >
                    {selectedNutritionistId === nutritionist._id ? 'Selected' : 'Select'}
                  </button>
                </li>
              ))}
            </ul>
            <button
              style={styles.modalButton}
              onClick={handleAssignNutritionist}
            >
              Confirm Assignment
            </button>
            <button
              style={styles.cancelButton}
              onClick={() => {
                setIsModalOpen(false);
                setSelectedMealPlanId(null);
                setSelectedNutritionistId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Mealplan;