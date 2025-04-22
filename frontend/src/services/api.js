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
export const getFitnessPrograms = () => API.get('/programs');

export const createBooking = (bookingData, config) =>
  API.post('/bookings', bookingData, config);

export const getBookings = () => API.get('/bookings'); // Fetch all bookings for the client
export const getBookingById = (bookingId) => API.get(`/bookings/${bookingId}`); // Fetch booking by ID

export const updateBookingStatus = (bookingId, statusData) =>
  API.put(`/bookings/${bookingId}/status`, statusData); // Update booking status

export const deleteBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`); // Delete booking

export const generateReceipt = async (data) => {
  try {
      const response = await axios.post('/api/payments/generate-receipt', data, {
          responseType: 'blob', // To handle the PDF file
      });

      // Create a URL for the PDF and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${data.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  } catch (error) {
      console.error('Error generating receipt:', error.response?.data || error.message);
      throw error;
  }
};
export default API;