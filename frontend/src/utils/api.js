import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as needed

// User Management
export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/profile/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/profile/${userId}`, profileData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Service Management
export const getServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/services`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const bookService = async (serviceId, bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/services/${serviceId}/book`, bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Meal Planning
export const getMealPlans = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/meals/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createMealPlan = async (userId, mealData) => {
    try {
        const response = await axios.post(`${API_URL}/meals/${userId}`, mealData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Dashboard
export const getDashboardData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};