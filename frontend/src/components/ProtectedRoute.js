import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Unauthorized! Please log in.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;