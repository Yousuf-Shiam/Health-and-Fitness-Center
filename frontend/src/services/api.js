import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
  }
  return config;
});

export const createUser = (userData) => API.post('/users', userData);
export const loginUser = (loginData) => API.post('/users/login', loginData); // Login API
export const getUsers = () => API.get('/users');
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const getUserById = (userId) => API.get(`/users/${userId}`);
// Program-related API calls
export const createFitnessService = (programData) => API.post('/programs', programData); // Add this function
export const getFitnessPrograms = () => API.get('/programs');

export const createBooking = (bookingData, config) =>
  API.post('/bookings', bookingData, config);

export const getBookings = () => API.get('/bookings'); // Fetch all bookings for the client
export const getBookingById = (bookingId) => API.get(`/bookings/${bookingId}`); // Fetch booking by ID

export const updateBookingStatus = (bookingId, statusData) =>
  API.put(`/bookings/${bookingId}/status`, statusData); // Update booking status

export const deleteBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`); // Delete booking
export const createMealPlan = (mealPlanData) => API.post('/mealplans', mealPlanData);
export const getMealPlans = (userId) => API.get(`/mealplans/${userId}`);


export default API;