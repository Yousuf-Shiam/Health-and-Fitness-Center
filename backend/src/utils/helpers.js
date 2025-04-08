// This file contains utility functions that assist with various operations throughout the application, such as validation and formatting.

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
};

const calculateBMI = (weight, height) => {
    if (height <= 0) return null;
    return (weight / (height * height)).toFixed(2);
};

module.exports = {
    validateEmail,
    formatDate,
    calculateBMI,
};