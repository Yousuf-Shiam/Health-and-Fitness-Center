import React, { useState, useEffect } from 'react';
import ClientNavBar from './ClientNavBar';

// Fitness Progress Graph Component
const FitnessProgressGraph = ({ dailyCaloriesBurned, workouts, calorieGoal = 500 }) => {
  const sortedDates = Object.keys(dailyCaloriesBurned).sort();
  const maxCalories = Math.max(...Object.values(dailyCaloriesBurned), calorieGoal);
  
  // Calculate weekly stats
  const totalCaloriesBurned = Object.values(dailyCaloriesBurned).reduce((sum, cal) => sum + cal, 0);
  const averageCaloriesBurned = totalCaloriesBurned / sortedDates.length || 0;
  const totalWorkouts = workouts.length;
  const workoutsThisWeek = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;
  
  // Calculate progress percentage for the latest day
  const latestDate = sortedDates[sortedDates.length - 1];
  const latestCaloriesBurned = dailyCaloriesBurned[latestDate] || 0;
  const progressPercentage = Math.min((latestCaloriesBurned / calorieGoal) * 100, 100);

  // Calculate workout types distribution
  const workoutTypes = {};
  workouts.forEach(workout => {
    const type = workout.name.toLowerCase();
    if (type.includes('run')) workoutTypes['Running'] = (workoutTypes['Running'] || 0) + 1;
    else if (type.includes('gym') || type.includes('weight')) workoutTypes['Gym/Weights'] = (workoutTypes['Gym/Weights'] || 0) + 1;
    else if (type.includes('yoga')) workoutTypes['Yoga'] = (workoutTypes['Yoga'] || 0) + 1;
    else if (type.includes('cardio')) workoutTypes['Cardio'] = (workoutTypes['Cardio'] || 0) + 1;
    else if (type.includes('swim')) workoutTypes['Swimming'] = (workoutTypes['Swimming'] || 0) + 1;
    else workoutTypes['Other'] = (workoutTypes['Other'] || 0) + 1;
  });

  return (
    <div style={fitnessGraphStyles.container}>
      <h2>🏋️‍♂️ Fitness Progress Dashboard</h2>
      
      {/* Progress Summary Cards */}
      <div style={fitnessGraphStyles.summaryCards}>
        <div style={fitnessGraphStyles.card}>
          <h3>Today's Burn Goal</h3>
          <div style={fitnessGraphStyles.progressBar}>
            <div 
              style={{
                ...fitnessGraphStyles.progressFill,
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage < 60 ? '#ff6b6b' : 
                                progressPercentage < 100 ? '#ffd93d' : '#6bcf7f'
              }}
            ></div>
          </div>
          <p>{latestCaloriesBurned} / {calorieGoal} calories ({Math.round(progressPercentage)}%)</p>
        </div>
        
        <div style={fitnessGraphStyles.card}>
          <h3>Weekly Average</h3>
          <div style={fitnessGraphStyles.avgNumber}>{Math.round(averageCaloriesBurned)}</div>
          <p>calories burned/day</p>
        </div>
        
        <div style={fitnessGraphStyles.card}>
          <h3>Total Workouts</h3>
          <div style={fitnessGraphStyles.avgNumber}>{totalWorkouts}</div>
          <p>sessions completed</p>
        </div>

        <div style={fitnessGraphStyles.card}>
          <h3>This Week</h3>
          <div style={fitnessGraphStyles.avgNumber}>{workoutsThisWeek}</div>
          <p>workout sessions</p>
        </div>
      </div>

      {/* Workout Types Distribution */}
      {Object.keys(workoutTypes).length > 0 && (
        <div style={fitnessGraphStyles.workoutTypesContainer}>
          <h3>💪 Workout Types Distribution</h3>
          <div style={fitnessGraphStyles.workoutTypes}>
            {Object.entries(workoutTypes).map(([type, count]) => {
              const percentage = (count / totalWorkouts) * 100;
              const colors = {
                'Running': '#ff6b6b',
                'Gym/Weights': '#4ecdc4',
                'Yoga': '#45b7d1',
                'Cardio': '#ffd93d',
                'Swimming': '#6bcf7f',
                'Other': '#a8a8a8'
              };
              return (
                <div key={type} style={fitnessGraphStyles.workoutType}>
                  <div style={fitnessGraphStyles.workoutTypeLabel}>{type}</div>
                  <div style={fitnessGraphStyles.workoutTypeBar}>
                    <div 
                      style={{
                        ...fitnessGraphStyles.workoutTypeBarFill,
                        width: `${percentage}%`,
                        backgroundColor: colors[type] || '#a8a8a8'
                      }}
                    ></div>
                  </div>
                  <div style={fitnessGraphStyles.workoutTypeCount}>{count} ({Math.round(percentage)}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Line Graph for Calories Burned */}
      {sortedDates.length > 0 && (
        <div style={fitnessGraphStyles.chartContainer}>
          <h3>🔥 Daily Calories Burned Trend</h3>
          <div style={fitnessGraphStyles.chart}>
            <div style={fitnessGraphStyles.yAxis}>
              <div style={fitnessGraphStyles.yLabel}>{maxCalories}</div>
              <div style={fitnessGraphStyles.yLabel}>{Math.round(maxCalories * 0.75)}</div>
              <div style={fitnessGraphStyles.yLabel}>{Math.round(maxCalories * 0.5)}</div>
              <div style={fitnessGraphStyles.yLabel}>{Math.round(maxCalories * 0.25)}</div>
              <div style={fitnessGraphStyles.yLabel}>0</div>
            </div>
            
            <div style={fitnessGraphStyles.plotArea}>
              {/* Goal line */}
              <div 
                style={{
                  ...fitnessGraphStyles.goalLine,
                  bottom: `${(calorieGoal / maxCalories) * 100}%`
                }}
              >
                <span style={fitnessGraphStyles.goalLabel}>Goal: {calorieGoal} cal</span>
              </div>
              
              {/* Data points and line */}
              <svg style={fitnessGraphStyles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={sortedDates.map((date, index) => {
                    const x = (index / (sortedDates.length - 1)) * 100;
                    const y = 100 - (dailyCaloriesBurned[date] / maxCalories) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#ff6b6b"
                  strokeWidth="0.5"
                />
                {sortedDates.map((date, index) => {
                  const x = (index / (sortedDates.length - 1)) * 100;
                  const y = 100 - (dailyCaloriesBurned[date] / maxCalories) * 100;
                  return (
                    <circle
                      key={date}
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="#ff6b6b"
                    />
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={fitnessGraphStyles.xAxis}>
                {sortedDates.map((date, index) => (
                  <div key={date} style={fitnessGraphStyles.xLabel}>
                    {new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Burn Progress */}
      <div style={fitnessGraphStyles.weeklyProgress}>
        <h3>🎯 Weekly Burn Progress</h3>
        <div style={fitnessGraphStyles.weekGrid}>
          {sortedDates.slice(-7).map((date) => {
            const caloriesBurned = dailyCaloriesBurned[date];
            const dayProgress = (caloriesBurned / calorieGoal) * 100;
            const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'short' });
            
            return (
              <div key={date} style={fitnessGraphStyles.dayColumn}>
                <div style={fitnessGraphStyles.dayLabel}>{dayOfWeek}</div>
                <div style={fitnessGraphStyles.dayBar}>
                  <div 
                    style={{
                      ...fitnessGraphStyles.dayBarFill,
                      height: `${Math.min(dayProgress, 100)}%`,
                      backgroundColor: dayProgress < 60 ? '#ff6b6b' : 
                                     dayProgress < 100 ? '#ffd93d' : '#6bcf7f'
                    }}
                  ></div>
                </div>
                <div style={fitnessGraphStyles.dayValue}>{caloriesBurned}</div>
                <div style={fitnessGraphStyles.daySubLabel}>cal</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fitness Streaks */}
      <div style={fitnessGraphStyles.streaksContainer}>
        <h3>🔥 Workout Streaks</h3>
        <div style={fitnessGraphStyles.streaks}>
          <div style={fitnessGraphStyles.streakCard}>
            <div style={fitnessGraphStyles.streakNumber}>
              {sortedDates.length > 0 ? Math.max(1, sortedDates.length) : 0}
            </div>
            <div style={fitnessGraphStyles.streakLabel}>Days Active</div>
          </div>
          <div style={fitnessGraphStyles.streakCard}>
            <div style={fitnessGraphStyles.streakNumber}>
              {Math.round(totalCaloriesBurned)}
            </div>
            <div style={fitnessGraphStyles.streakLabel}>Total Calories Burned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <h1>🏃‍♂️ Fitness Tracking</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Fitness Progress Graph Component */}
        <FitnessProgressGraph 
          dailyCaloriesBurned={dailyCaloriesBurned} 
          workouts={workouts}
          calorieGoal={500} 
        />

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Workout Name (e.g., Running, Gym, Yoga)"
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

        <h2>🏋️ Workout History</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Workout Name</th>
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

        <h2>📊 Daily Calorie Burn Summary</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Calories Burned</th>
              <th>Progress Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dailyCaloriesBurned).map(([date, totalCaloriesBurned]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{totalCaloriesBurned}</td>
                <td>
                  <span style={{
                    ...styles.progressStatus,
                    backgroundColor: totalCaloriesBurned < 300 ? '#ff6b6b' :
                                   totalCaloriesBurned < 500 ? '#ffd93d' : '#6bcf7f',
                    color: 'white'
                  }}>
                    {totalCaloriesBurned < 300
                      ? 'Light Activity'
                      : totalCaloriesBurned < 500
                      ? 'Good Progress'
                      : 'Excellent!'}
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
    minWidth: '200px',
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
  progressStatus: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
};

// Fitness Progress Graph Styles
const fitnessGraphStyles = {
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  progressBar: {
    width: '100%',
    height: '20px',
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    color: 'white',
    margin: '0.5rem 0',
  },
  workoutTypesContainer: {
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  workoutTypes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  workoutType: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  workoutTypeLabel: {
    minWidth: '100px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#495057',
  },
  workoutTypeBar: {
    flex: '1',
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  workoutTypeBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  workoutTypeCount: {
    minWidth: '80px',
    fontSize: '0.8rem',
    color: '#6c757d',
    textAlign: 'right',
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
    backgroundColor: '#ffd93d',
    borderStyle: 'dashed',
    borderWidth: '1px 0 0 0',
    borderColor: '#ffd93d',
  },
  goalLabel: {
    position: 'absolute',
    right: '5px',
    top: '-10px',
    fontSize: '0.7rem',
    color: '#ffd93d',
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
    marginBottom: '2rem',
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
    minWidth: '70px',
  },
  dayLabel: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '0.5rem',
  },
  dayBar: {
    width: '35px',
    height: '120px',
    backgroundColor: '#e9ecef',
    borderRadius: '17px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
  },
  dayBarFill: {
    width: '100%',
    borderRadius: '17px',
    transition: 'height 0.3s ease',
  },
  dayValue: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '0.5rem',
    fontWeight: 'bold',
  },
  daySubLabel: {
    fontSize: '0.6rem',
    color: '#999',
  },
  streaksContainer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  streaks: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  streakCard: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '150px',
  },
  streakNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  streakLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 'bold',
  },
};

export default FitnessTracking;