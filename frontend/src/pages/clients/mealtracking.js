import React, { useState, useEffect } from 'react';
import ClientNavBar from './ClientNavBar';

const MealTracking = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/meals', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }

        const data = await response.json();
        setMeals(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleAddMeal = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/meals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeal),
      });

      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      const addedMeal = await response.json();
      setMeals([...meals, addedMeal]);
      setNewMeal({ name: '', calories: '', date: '' });
    } catch (error) {
      alert(`Error adding meal: ${error.message}`);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      setMeals(meals.filter((meal) => meal._id !== mealId));
    } catch (error) {
      alert(`Error deleting meal: ${error.message}`);
    }
  };

  // Calculate total calories for each day
  const calculateDailyCalories = () => {
    const dailyCalories = {};
    meals.forEach((meal) => {
      const date = meal.date;
      if (!dailyCalories[date]) {
        dailyCalories[date] = 0;
      }
      dailyCalories[date] += parseInt(meal.calories, 10);
    });
    return dailyCalories;
  };

  const dailyCalories = calculateDailyCalories();

  return (
    <>
      <ClientNavBar />
      <div style={styles.container}>
        <h1>Meal Tracking</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            style={styles.input}
          />
          <input
            type="date"
            value={newMeal.date}
            onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleAddMeal} style={styles.addButton}>
            Add Meal
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Calories</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id}>
                <td>{meal.name}</td>
                <td>{meal.calories}</td>
                <td>{meal.date}</td>
                <td>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Daily Calorie Summary</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Calories</th>
              <th>Health Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dailyCalories).map(([date, totalCalories]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{totalCalories}</td>
                <td>
                  {totalCalories < 2000
                    ? 'Too Low'
                    : totalCalories <= 2500
                    ? 'Healthy'
                    : 'Too High'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  form: {
    marginBottom: '1rem',
  },
  input: {
    marginRight: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
};

export default MealTracking;