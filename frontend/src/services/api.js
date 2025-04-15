import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

export const createUser = (userData) => API.post('/users', userData);
export const loginUser = (loginData) => API.post('/users/login', loginData); // Login API
export const getUsers = () => API.get('/users');
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
// Program-related API calls
export const createFitnessService = (programData) => API.post('/programs', programData); // Add this function

export default API;