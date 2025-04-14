import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

export const createUser = (userData) => API.post('/users', userData);
export const getUsers = () => API.get('/users');
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);

export default API;