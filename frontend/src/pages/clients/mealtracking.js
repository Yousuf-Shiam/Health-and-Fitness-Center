import React, { useState, useEffect } from 'react';
import ClientNavBar from './ClientNavBar';

// Progress Graph Component
const ProgressGraph = ({ dailyCalories, calorieGoal = 2200 }) => {
  const sortedDates = Object.keys(dailyCalories).sort();
  const maxCalories = Math.max(...Object.values(dailyCalories), calorieGoal);
  
  // Calculate weekly average
  const totalCalories = Object.values(dailyCalories).reduce((sum, cal) => sum + cal, 0);
  const averageCalories = totalCalories / sortedDates.length || 0;
  
  // Calculate progress percentage for the latest day
  const latestDate = sortedDates[sortedDates.length - 1];
  const latestCalories = dailyCalories[latestDate] || 0;
  const progressPercentage = Math.min((latestCalories / calorieGoal) * 100, 100);

  return (
    <div style={graphStyles.container}>
      <h2>📊 Calorie Progress</h2>
      
      {/* Progress Summary Cards */}
      <div style={graphStyles.summaryCards}>
        <div style={graphStyles.card}>
          <h3>Today's Progress</h3>
          <div style={graphStyles.progressBar}>
            <div 
              style={{
                ...graphStyles.progressFill,
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage < 80 ? '#ff6b6b' : 
                                progressPercentage < 100 ? '#4ecdc4' : '#45b7d1'
              }}
            ></div>
          </div>
          <p>{latestCalories} / {calorieGoal} calories ({Math.round(progressPercentage)}%)</p>
        </div>
        
        <div style={graphStyles.card}>
          <h3>Weekly Average</h3>
          <div style={graphStyles.avgNumber}>{Math.round(averageCalories)}</div>
          <p>calories per day</p>
        </div>
        
        <div style={graphStyles.card}>
          <h3>Total Days Tracked</h3>
          <div style={graphStyles.avgNumber}>{sortedDates.length}</div>
          <p>days</p>
        </div>
      </div>

      {/* Line Graph */}
      {sortedDates.length > 0 && (
        <div style={graphStyles.chartContainer}>
          <h3>📈 Daily Calorie Trend</h3>
          <div style={graphStyles.chart}>
            <div style={graphStyles.yAxis}>
              <div style={graphStyles.yLabel}>{maxCalories}</div>
              <div style={graphStyles.yLabel}>{Math.round(maxCalories * 0.75)}</div>
              <div style={graphStyles.yLabel}>{Math.round(maxCalories * 0.5)}</div>
              <div style={graphStyles.yLabel}>{Math.round(maxCalories * 0.25)}</div>
              <div style={graphStyles.yLabel}>0</div>
            </div>
            
            <div style={graphStyles.plotArea}>
              {/* Goal line */}
              <div 
                style={{
                  ...graphStyles.goalLine,
                  bottom: `${(calorieGoal / maxCalories) * 100}%`
                }}
              >
                <span style={graphStyles.goalLabel}>Goal: {calorieGoal}</span>
              </div>
              
              {/* Data points and line */}
              <svg style={graphStyles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={sortedDates.map((date, index) => {
                    const x = (index / (sortedDates.length - 1)) * 100;
                    const y = 100 - (dailyCalories[date] / maxCalories) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#45b7d1"
                  strokeWidth="0.5"
                />
                {sortedDates.map((date, index) => {
                  const x = (index / (sortedDates.length - 1)) * 100;
                  const y = 100 - (dailyCalories[date] / maxCalories) * 100;
                  return (
                    <circle
                      key={date}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="#45b7d1"
                    />
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={graphStyles.xAxis}>
                {sortedDates.map((date, index) => (
                  <div key={date} style={graphStyles.xLabel}>
                    {new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      <div style={graphStyles.weeklyProgress}>
        <h3>🎯 Weekly Goal Progress</h3>
        <div style={graphStyles.weekGrid}>
          {sortedDates.slice(-7).map((date) => {
            const calories = dailyCalories[date];
            const dayProgress = (calories / calorieGoal) * 100;
            const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'short' });
            
            return (
              <div key={date} style={graphStyles.dayColumn}>
                <div style={graphStyles.dayLabel}>{dayOfWeek}</div>
                <div style={graphStyles.dayBar}>
                  <div 
                    style={{
                      ...graphStyles.dayBarFill,
                      height: `${Math.min(dayProgress, 100)}%`,
                      backgroundColor: dayProgress < 80 ? '#ff6b6b' : 
                                     dayProgress < 100 ? '#4ecdc4' : '#45b7d1'
                    }}
                  ></div>
                </div>
                <div style={graphStyles.dayValue}>{calories}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
        <h1>🍽️ Meal Tracking</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Progress Graph Component */}
        <ProgressGraph dailyCalories={dailyCalories} calorieGoal={2200} />

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

        <h2>📋 Meal History</h2>
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

        <h2>📊 Daily Calorie Summary</h2>
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
                  <span style={{
                    ...styles.healthStatus,
                    backgroundColor: totalCalories < 2000 ? '#ff6b6b' :
                                   totalCalories <= 2500 ? '#4ecdc4' : '#ff9f43',
                    color: 'white'
                  }}>
                    {totalCalories < 2000
                      ? 'Too Low'
                      : totalCalories <= 2500
                      ? 'Healthy'
                      : 'Too High'}
                  </span>
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
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  form: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  healthStatus: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
};

// Progress Graph Styles
const graphStyles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  summaryCards: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  progressBar: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '0.5rem 0',
  },
  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  avgNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#45b7d1',
    margin: '0.5rem 0',
  },
  chartContainer: {
    marginBottom: '2rem',
  },
  chart: {
    display: 'flex',
    height: '300px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fafafa',
  },
  yAxis: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '60px',
    paddingRight: '10px',
  },
  yLabel: {
    fontSize: '0.8rem',
    color: '#666',
    textAlign: 'right',
  },
  plotArea: {
    flex: '1',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  goalLine: {
    position: 'absolute',
    left: '0',
    right: '0',
    height: '1px',
    backgroundColor: '#ff6b6b',
    borderStyle: 'dashed',
    borderWidth: '1px 0 0 0',
    borderColor: '#ff6b6b',
  },
  goalLabel: {
    position: 'absolute',
    right: '5px',
    top: '-10px',
    fontSize: '0.7rem',
    color: '#ff6b6b',
    backgroundColor: 'white',
    padding: '0 5px',
  },
  svg: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },
  xAxis: {
    position: 'absolute',
    bottom: '-25px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-between',
  },
  xLabel: {
    fontSize: '0.7rem',
    color: '#666',
    textAlign: 'center',
    flex: '1',
  },
  weeklyProgress: {
    marginTop: '2rem',
  },
  weekGrid: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dayColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '60px',
  },
  dayLabel: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '0.5rem',
  },
  dayBar: {
    width: '30px',
    height: '100px',
    backgroundColor: '#e9ecef',
    borderRadius: '15px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
  },
  dayBarFill: {
    width: '100%',
    borderRadius: '15px',
    transition: 'height 0.3s ease',
  },
  dayValue: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '0.5rem',
    fontWeight: 'bold',
  },
};

export default MealTracking;