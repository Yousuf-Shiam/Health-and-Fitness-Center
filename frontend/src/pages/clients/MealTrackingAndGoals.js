import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { saveMealTracker, getMealTracker } from '../../services/api';
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component

function MealTrackingAndGoals() {
  const [mealTracker, setMealTracker] = useState({
    Monday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Tuesday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Wednesday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Thursday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Friday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Saturday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
    Sunday: { breakfast: '', lunch: '', dinner: '', snacks: '' },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Fetch meal tracker data when the component loads
  useEffect(() => {
    const fetchMealTracker = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        setLoading(true);
        const response = await getMealTracker(userId);
        // Ensure only the days of the week are set in the state
        const filteredMealTracker = {
          Monday: response.data.mealTracker.Monday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Tuesday: response.data.mealTracker.Tuesday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Wednesday: response.data.mealTracker.Wednesday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Thursday: response.data.mealTracker.Thursday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Friday: response.data.mealTracker.Friday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Saturday: response.data.mealTracker.Saturday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
          Sunday: response.data.mealTracker.Sunday || { breakfast: '', lunch: '', dinner: '', snacks: '' },
        };
        setMealTracker(filteredMealTracker);
      } catch (error) {
        console.error('Error fetching meal tracker:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealTracker();
  }, []);

  const handleInputChange = (day, mealType, value) => {
    setMealTracker((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }));
  };

  const handleSave = async () => {
    // Check if any input is provided
    const isEmpty = Object.values(mealTracker).every((day) =>
      Object.values(day).every((meal) => meal.trim() === '')
    );

    if (isEmpty) {
      alert('Please enter at least one meal before saving.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        alert('User is not logged in. Please log in again.');
        return;
      }

      console.log('Saving meal tracker:', { mealTracker }); // Debugging log
      await saveMealTracker({ mealTracker }); // Send only the mealTracker data
      alert('Meal Tracker saved successfully!');

      // Redirect to ClientHomePage after saving
      navigate('/client-home');
    } catch (error) {
      console.error('Error saving meal tracker:', error.response || error.message);
      alert('Failed to save meal tracker. Please try again.');
    }
  };

  return (
    <>
      {/* Include the ClientNavBar */}
      <ClientNavBar />

      {/* Main Content */}
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', color: '#0f5132' }}>Weekly Meal Tracker</h1>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#0d6efd' }}>Loading...</p>
        ) : (
          <div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '2rem',
                textAlign: 'center',
              }}
            >
              <thead>
                <tr>
                  <th style={styles.headerCell}>Day</th>
                  <th style={styles.headerCell}>Breakfast</th>
                  <th style={styles.headerCell}>Lunch</th>
                  <th style={styles.headerCell}>Dinner</th>
                  <th style={styles.headerCell}>Snacks</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(mealTracker).map((day) => (
                  <tr key={day}>
                    <td style={styles.dayCell}>{day}</td>
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                      <td key={mealType} style={styles.cell}>
                        <input
                          type="text"
                          value={mealTracker[day][mealType]}
                          onChange={(e) => handleInputChange(day, mealType, e.target.value)}
                          placeholder={`Enter ${mealType}`}
                          style={styles.input}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleSave}
              style={{
                marginTop: '2rem',
                padding: '0.8rem 2rem',
                backgroundColor: '#0f5132',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Save Meal Tracker
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  headerCell: {
    border: '1px solid #ccc',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  dayCell: {
    border: '1px solid #ccc',
    padding: '1rem',
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
  },
  cell: {
    border: '1px solid #ccc',
    padding: '1rem',
  },
  input: {
    width: '90%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

export default MealTrackingAndGoals;