import React, { useState, useEffect } from 'react';
import { getBMIRecommendations, updatePhysicalData } from '../../services/api';
import ClientNavBar from './ClientNavBar';
import Footer from '../../components/Footer';

function BMIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  const [physicalData, setPhysicalData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: ''
  });

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getBMIRecommendations();
      setRecommendations(response.data);
      
      // Update physical data state with current values
      if (response.data.user) {
        const userData = response.data.user;
        setPhysicalData({
          height: userData.height || '',
          weight: userData.weight || '',
          age: userData.age || '',
          gender: userData.gender || ''
        });
        setFormData({
          height: userData.height || '',
          weight: userData.weight || '',
          age: userData.age || '',
          gender: userData.gender || ''
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch recommendations');
      if (error.response?.status === 400) {
        setShowUpdateForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePhysicalData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updatePhysicalData(formData);
      setSuccess('Physical data updated successfully!');
      setShowUpdateForm(false);
      // Fetch recommendations again with updated data
      await fetchRecommendations();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update physical data');
    } finally {
      setLoading(false);
    }
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return '#3498db'; // Blue for underweight
    if (bmi >= 18.5 && bmi < 25) return '#27ae60'; // Green for normal
    if (bmi >= 25 && bmi < 30) return '#f39c12'; // Orange for overweight
    return '#e74c3c'; // Red for obese
  };

  const getBMIStatus = (category) => {
    const statuses = {
      underweight: 'Underweight',
      normal: 'Normal Weight',
      overweight: 'Overweight',
      obese: 'Obese'
    };
    return statuses[category] || category;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#2c3e50',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '1px solid #c3e6cb',
    },
    updateButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
    bmiCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    bmiValue: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    bmiCategory: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    userInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    infoItem: {
      textAlign: 'center',
    },
    infoLabel: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '0.25rem',
    },
    infoValue: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2c3e50',
    },
    recommendationsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    recommendationCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    recommendationList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    recommendationItem: {
      padding: '0.5rem 0',
      borderBottom: '1px solid #eee',
      fontSize: '0.95rem',
      color: '#555',
    },
    form: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#2c3e50',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    submitButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginRight: '1rem',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '0.75rem 2rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#666',
      padding: '2rem',
    },
  };

  if (loading && !recommendations) {
    return (
      <div style={styles.container}>
        <ClientNavBar />
        <div style={styles.content}>
          <div style={styles.loading}>Loading recommendations...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ClientNavBar />
      <div style={styles.content}>
        <h1 style={styles.header}>BMI-Based Health Recommendations</h1>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.successMessage}>
            {success}
          </div>
        )}

        {!showUpdateForm && recommendations && (
          <button 
            style={styles.updateButton}
            onClick={() => setShowUpdateForm(true)}
          >
            Update Physical Information
          </button>
        )}

        {showUpdateForm && (
          <form onSubmit={handleUpdatePhysicalData} style={styles.form}>
            <h2>Update Your Physical Information</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Height (cm) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  min="100"
                  max="250"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  style={styles.input}
                  min="13"
                  max="100"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{marginTop: '1.5rem'}}>
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update & Get Recommendations'}
              </button>
              <button 
                type="button"
                onClick={() => setShowUpdateForm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {recommendations && (
          <>
            {/* BMI Information Card */}
            <div style={styles.bmiCard}>
              <div 
                style={{
                  ...styles.bmiValue,
                  color: getBMIColor(recommendations.user.bmi)
                }}
              >
                {recommendations.user.bmi}
              </div>
              <div 
                style={{
                  ...styles.bmiCategory,
                  color: getBMIColor(recommendations.user.bmi)
                }}
              >
                {getBMIStatus(recommendations.user.bmiCategory)}
              </div>
              
              <div style={styles.userInfo}>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Height</div>
                  <div style={styles.infoValue}>{recommendations.user.height} cm</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Weight</div>
                  <div style={styles.infoValue}>{recommendations.user.weight} kg</div>
                </div>
                {recommendations.user.age && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Age</div>
                    <div style={styles.infoValue}>{recommendations.user.age} years</div>
                  </div>
                )}
                {recommendations.user.gender && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Gender</div>
                    <div style={styles.infoValue}>
                      {recommendations.user.gender.charAt(0).toUpperCase() + recommendations.user.gender.slice(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations Grid */}
            <div style={styles.recommendationsGrid}>
              {/* Diet Recommendations */}
              <div style={styles.recommendationCard}>
                <h3 style={styles.cardTitle}>
                  🥗 Diet Recommendations
                </h3>
                <ul style={styles.recommendationList}>
                  {recommendations.recommendations.diet?.map((item, index) => (
                    <li key={index} style={styles.recommendationItem}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exercise Recommendations */}
              <div style={styles.recommendationCard}>
                <h3 style={styles.cardTitle}>
                  💪 Exercise Recommendations
                </h3>
                <ul style={styles.recommendationList}>
                  {recommendations.recommendations.exercise?.map((item, index) => (
                    <li key={index} style={styles.recommendationItem}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lifestyle Recommendations */}
              <div style={styles.recommendationCard}>
                <h3 style={styles.cardTitle}>
                  🌟 Lifestyle Recommendations
                </h3>
                <ul style={styles.recommendationList}>
                  {recommendations.recommendations.lifestyle?.map((item, index) => (
                    <li key={index} style={styles.recommendationItem}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meal Plan Recommendations */}
              {recommendations.recommendations.external?.mealPlan && (
                <div style={{...styles.recommendationCard, gridColumn: 'span 2'}}>
                  <h3 style={styles.cardTitle}>
                    🍽️ Personalized Meal Plan
                    {recommendations.recommendations.external.mealPlan.dailyCalories && 
                      <span style={{fontSize: '0.9rem', color: '#666', marginLeft: '1rem'}}>
                        (~{recommendations.recommendations.external.mealPlan.dailyCalories} calories/day)
                      </span>
                    }
                  </h3>
                  
                  {recommendations.recommendations.external.mealPlan.success ? (
                    <div style={{marginTop: '1rem'}}>
                      {recommendations.recommendations.external.mealPlan.mealPlan?.slice(0, 3).map((day, index) => (
                        <div key={index} style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}>
                          <h4 style={{color: '#495057', marginBottom: '0.5rem'}}>Day {day.day}</h4>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.9rem'}}>
                            <div><strong>Breakfast:</strong> {typeof day.meals.breakfast === 'string' ? day.meals.breakfast : 'Healthy breakfast option'}</div>
                            <div><strong>Lunch:</strong> {typeof day.meals.lunch === 'string' ? day.meals.lunch : 'Nutritious lunch option'}</div>
                            <div><strong>Dinner:</strong> {typeof day.meals.dinner === 'string' ? day.meals.dinner : 'Balanced dinner option'}</div>
                          </div>
                          {day.totalCalories > 0 && (
                            <div style={{marginTop: '0.5rem', fontSize: '0.8rem', color: '#666'}}>
                              Calories: {Math.round(day.totalCalories)} | Protein: {Math.round(day.totalProtein)}g | 
                              Carbs: {Math.round(day.totalCarbs)}g | Fat: {Math.round(day.totalFat)}g
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', fontSize: '0.9rem'}}>
                        💡 This is a 7-day meal plan tailored to your BMI category. Consult with a nutritionist for detailed portion sizes.
                      </div>
                    </div>
                  ) : (
                    <div style={{marginTop: '1rem'}}>
                      {recommendations.recommendations.external.mealPlan.fallbackMeals && (
                        <div>
                          <div style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e3f2fd', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #90caf9'}}>
                            💡 <strong>Personalized Meal Suggestions</strong> - Here are carefully curated meal options based on your BMI category and nutritional needs.
                          </div>
                          
                          {/* Show weekly meal plan if available */}
                          {recommendations.recommendations.external.mealPlan.fallbackMeals.weeklyPlan && (
                            <div style={{marginBottom: '2rem'}}>
                              <h4 style={{color: '#1976d2', marginBottom: '1rem'}}>📅 7-Day Meal Plan</h4>
                              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
                                {recommendations.recommendations.external.mealPlan.fallbackMeals.weeklyPlan.slice(0, 7).map((day, index) => (
                                  <div key={index} style={{
                                    padding: '1rem',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                  }}>
                                    <h5 style={{color: '#495057', marginBottom: '0.75rem', borderBottom: '2px solid #007bff', paddingBottom: '0.25rem'}}>
                                      Day {day.day}
                                    </h5>
                                    <div style={{fontSize: '0.85rem', lineHeight: '1.4'}}>
                                      <div style={{marginBottom: '0.5rem'}}>
                                        <strong style={{color: '#fd7e14'}}>🌅 Breakfast:</strong><br/>
                                        {day.breakfast}
                                      </div>
                                      <div style={{marginBottom: '0.5rem'}}>
                                        <strong style={{color: '#20c997'}}>☀️ Lunch:</strong><br/>
                                        {day.lunch}
                                      </div>
                                      <div>
                                        <strong style={{color: '#6f42c1'}}>🌙 Dinner:</strong><br/>
                                        {day.dinner}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Fallback to category-based suggestions */}
                          {!recommendations.recommendations.external.mealPlan.fallbackMeals.weeklyPlan && (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
                              <div>
                                <h4 style={{color: '#fd7e14'}}>🌅 Breakfast Ideas:</h4>
                                <ul style={styles.recommendationList}>
                                  {recommendations.recommendations.external.mealPlan.fallbackMeals.breakfast?.map((item, index) => (
                                    <li key={index} style={styles.recommendationItem}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 style={{color: '#20c997'}}>☀️ Lunch Ideas:</h4>
                                <ul style={styles.recommendationList}>
                                  {recommendations.recommendations.external.mealPlan.fallbackMeals.lunch?.map((item, index) => (
                                    <li key={index} style={styles.recommendationItem}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 style={{color: '#6f42c1'}}>🌙 Dinner Ideas:</h4>
                                <ul style={styles.recommendationList}>
                                  {recommendations.recommendations.external.mealPlan.fallbackMeals.dinner?.map((item, index) => (
                                    <li key={index} style={styles.recommendationItem}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {/* Calorie information */}
                          {recommendations.recommendations.external.mealPlan.dailyCalories && (
                            <div style={{marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ffb74d'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                                <span style={{fontSize: '1.2rem'}}>🎯</span>
                                <strong style={{color: '#ef6c00'}}>Daily Calorie Target: ~{recommendations.recommendations.external.mealPlan.dailyCalories} calories</strong>
                              </div>
                              <div style={{fontSize: '0.9rem', color: '#bf360c'}}>
                                These meal suggestions are tailored to your BMI category and calculated daily calorie needs.
                              </div>
                            </div>
                          )}
                          
                          {/* Additional tips */}
                          <div style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f3e5f5', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #ba68c8'}}>
                            <strong>💜 Pro Tips:</strong>
                            <ul style={{margin: '0.5rem 0 0 0', paddingLeft: '1.2rem'}}>
                              <li>Adjust portion sizes based on your hunger and activity level</li>
                              <li>Stay hydrated with 8-10 glasses of water daily</li>
                              <li>Consider consulting with a registered dietitian for personalized guidance</li>
                              <li>All calorie counts are approximate - focus on balanced nutrition</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Nutrition & Exercise Tips */}
              {(recommendations.recommendations.external?.nutritionTips || recommendations.recommendations.external?.exerciseTips) && (
                <div style={styles.recommendationCard}>
                  <h3 style={styles.cardTitle}>
                    🔬 Expert Tips
                  </h3>
                  {recommendations.recommendations.external.nutritionTips && (
                    <div>
                      <h4 style={{color: '#495057', marginBottom: '0.5rem'}}>Nutrition:</h4>
                      <ul style={styles.recommendationList}>
                        {recommendations.recommendations.external.nutritionTips.map((item, index) => (
                          <li key={index} style={styles.recommendationItem}>
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {recommendations.recommendations.external.exerciseTips && (
                    <div style={{marginTop: '1rem'}}>
                      <h4 style={{color: '#495057', marginBottom: '0.5rem'}}>Exercise:</h4>
                      <ul style={styles.recommendationList}>
                        {recommendations.recommendations.external.exerciseTips.map((item, index) => (
                          <li key={index} style={styles.recommendationItem}>
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Supplement Recommendations */}
              {recommendations.recommendations.external?.supplementRecommendations && (
                <div style={styles.recommendationCard}>
                  <h3 style={styles.cardTitle}>
                    💊 Supplement Suggestions
                  </h3>
                  <ul style={styles.recommendationList}>
                    {recommendations.recommendations.external.supplementRecommendations.map((item, index) => (
                      <li key={index} style={styles.recommendationItem}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '0.8rem'}}>
                    ⚠️ Consult with a healthcare provider before starting any supplement regimen.
                  </div>
                </div>
              )}

              {/* Error Handling for External APIs */}
              {recommendations.recommendations.external?.error && (
                <div style={styles.recommendationCard}>
                  <h3 style={styles.cardTitle}>
                    📋 General Health Tips
                  </h3>
                  <div style={{marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '0.9rem'}}>
                    ℹ️ {recommendations.recommendations.external.error}
                  </div>
                  {recommendations.recommendations.external.fallbackTips && (
                    <div>
                      <h4>Nutrition:</h4>
                      <ul style={styles.recommendationList}>
                        {recommendations.recommendations.external.fallbackTips.nutritionTips?.map((item, index) => (
                          <li key={index} style={styles.recommendationItem}>• {item}</li>
                        ))}
                      </ul>
                      <h4>Exercise:</h4>
                      <ul style={styles.recommendationList}>
                        {recommendations.recommendations.external.fallbackTips.exerciseTips?.map((item, index) => (
                          <li key={index} style={styles.recommendationItem}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default BMIRecommendations;
