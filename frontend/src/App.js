import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ClientHomePage from './pages/clients/ClientHomePage';
import TrainerHomePage from './pages/trainers/TrainerHomePage';
import NutritionistHomePage from './pages/nutritionists/NutritionistHomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientProfile from './pages/clients/ClientProfile';
import NutritionistProfile from './pages/nutritionists/NutritionistProfile';
import DietProgramCreation from './pages/nutritionists/DietProgramCreation';
import TrainerProfile from './pages/trainers/TrainerProfile';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/client-home"
          element={
            <ProtectedRoute>
              <ClientHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/trainer-home"
          element={
            <ProtectedRoute>
              <TrainerHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionist-home"
          element={
            <ProtectedRoute>
              <NutritionistHomePage />
            </ProtectedRoute>
          }
          
        />
        <Route
         path="/trainer-profile"
         element={
         <TrainerProfile />
         } 
        />
        <Route
          path="/nutritionist-profile"
          element={
            <ProtectedRoute>
              <NutritionistProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionist-create-program"
          element={
            <ProtectedRoute>
              <DietProgramCreation />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Router>
  );
}

export default App;