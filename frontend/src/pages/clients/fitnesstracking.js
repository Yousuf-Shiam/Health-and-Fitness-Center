import React, { useState, useEffect } from 'react';
import ClientNavBar from './ClientNavBar';

const FitnessTracking = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ name: '', caloriesBurned: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/workouts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      });

      if (!response.ok) {
        throw new Error('Failed to add workout');
      }

      const addedWorkout = await response.json();
      setWorkouts([...workouts, addedWorkout]);
      setNewWorkout({ name: '', caloriesBurned: '', date: '' });
    } catch (error) {
      alert(`Error adding workout: ${error.message}`);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
    } catch (error) {
      alert(`Error deleting workout: ${error.message}`);
    }
  };

  // Calculate total calories burned for each day
  const calculateDailyCaloriesBurned = () => {
    const dailyCaloriesBurned = {};
    workouts.forEach((workout) => {
      const date = workout.date;
      if (!dailyCaloriesBurned[date]) {
        dailyCaloriesBurned[date] = 0;
      }
      dailyCaloriesBurned[date] += parseInt(workout.caloriesBurned, 10);
    });
    return dailyCaloriesBurned;
  };

  const dailyCaloriesBurned = calculateDailyCaloriesBurned();

  return (
    <>
      <ClientNavBar />
      <div style={styles.container}>
        <h1>Fitness Tracking</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Workout Name"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Calories Burned"
            value={newWorkout.caloriesBurned}
            onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
            style={styles.input}
          />
          <input
            type="date"
            value={newWorkout.date}
            onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleAddWorkout} style={styles.addButton}>
            Add Workout
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Calories Burned</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{workout.name}</td>
                <td>{workout.caloriesBurned}</td>
                <td>{workout.date}</td>
                <td>
                  <button
                    onClick={() => handleDeleteWorkout(workout._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Daily Calorie Burn Summary</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Calories Burned</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dailyCaloriesBurned).map(([date, totalCaloriesBurned]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{totalCaloriesBurned}</td>
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

export default FitnessTracking;