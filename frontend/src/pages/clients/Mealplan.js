import React, { useEffect, useState } from 'react';
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer'; // Import the Footer component
import { getMealPlans } from '../../services/api'; // Import the API function
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

function Mealplan() {
  const [mealPlans, setMealPlans] = useState([]); // State to store meal plans
  const [clientName, setClientName] = useState(''); // State to store the client's name

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
  };

  // Fetch client name and meal plans
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);

        // Fetch meal plans for the client
        const response = await getMealPlans();
        setMealPlans(response.data);

        // Optionally, fetch user details for the name
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
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };

    fetchMealPlans();
  }, []);


  return (
    <>
 <div style={styles.container}>
        <ClientNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome, {clientName}!</h1>
          <p style={styles.subheading}>Here are your created meal plans:</p>

          {/* Meal Plans Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Your Meal Plans</h2>
            {mealPlans.length > 0 ? (
              mealPlans.map((plan, index) => (
                <div key={index} style={styles.item}>
                  <h3>{plan.name}</h3>
                  <p><strong>Description:</strong> {plan.description}</p>
                  <p><strong>Fitness Goal:</strong> {plan.fitnessGoal}</p>
                  <p><strong>Preferences:</strong> {plan.preferences || 'None'}</p>
                  <ul>
                    {plan.mealPlan.map((meal, mealIndex) => (
                      <li key={mealIndex}>
                        <strong>{meal.meal}:</strong> {meal.items.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ color: '#888', fontSize: '18px' }}>
                You have not created any meal plans yet.
              </p>
            )}
          </div>

          {/* Button to Create New Meal Plan */}
          <button
            style={styles.button}
            onClick={() => (window.location.href = '/create-meal-plan')}
          >
            Create New Meal Plan
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mealplan;