import axios from 'axios';

const API = axios.create({
  baseURL: '${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api', // Backend URL
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
  }
  return config;
});

// User-related API calls
export const createUser = (userData) => API.post('/users', userData);
export const loginUser = (loginData) => API.post('/users/login', loginData); // Login API
export const getUsers = () => API.get('/users');
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const getUserById = (userId) => API.get(`/users/${userId}`);

// Program-related API calls
export const createFitnessService = (programData) => API.post('/programs', programData); // Add this function
export const getFitnessPrograms = () => API.get('/programs');

// Booking-related API calls
export const createBooking = (bookingData, config) =>
  API.post('/bookings', bookingData, config);
export const getBookings = () => API.get('/bookings'); // Fetch all bookings for the client
export const getBookingById = (bookingId) => API.get(`/bookings/${bookingId}`); // Fetch booking by ID
export const updateBookingStatus = (bookingId, statusData) =>
  API.put(`/bookings/${bookingId}/status`, statusData); // Update booking status
export const deleteBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`); // Delete booking

// Meal Plan-related API calls
export const createMealPlan = (mealPlanData) => API.post('/mealplans', mealPlanData);
export const getMealPlans = () => API.get('/mealplans'); // Fetch meal plans for the authenticated user
export const assignNutritionist = (mealPlanId, nutritionistData) =>
  API.put(`/mealplans/${mealPlanId}/assign-nutritionist`, nutritionistData); // Assign a nutritionist to a meal plan
export const updateApprovalStatus = (mealPlanId, approvalData) =>
  API.put(`/mealplans/${mealPlanId}/approval-status`, approvalData); // Update approval status of a meal plan

// Meal Tracking and Fitness Goals API calls (New)
export const getFitnessGoals = (userId) => API.get(`/fitness-goals/${userId}`); // Fetch fitness goals for a user
export const updateFitnessGoal = (userId, goalData) =>
  API.put(`/fitness-goals/${userId}`, goalData); // Update fitness goal
export const trackMeal = (mealData) => API.post('/meal-tracking', mealData); // Track a meal
export const getMealTracking = (userId) => API.get(`/meal-tracking/${userId}`); // Fetch meal tracking data for a user

// Fetch meal plans assigned to the logged-in nutritionist
export const getAssignedMealPlans = () => API.get('/mealplans/assigned');

// Update a meal plan
export const updateMealPlan = (mealPlanId, mealPlanData) =>
  API.put(`/mealplans/${mealPlanId}`, mealPlanData);

export const updateRecommendations = (mealPlanId, recommendationsData) =>
  API.put(`/mealplans/${mealPlanId}/recommendations`, recommendationsData);

// Notification-related API calls
// Fetch all notifications for the logged-in user
export const getNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await API.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export default API;

