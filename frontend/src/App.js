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
import NutritionistProgramCreation from './pages/nutritionists/NutritionistProgramCreation'; // Import the new component
import TrainerProfile from './pages/trainers/TrainerProfile';
import TrainerProgramCreation from './pages/trainers/TrainerProgramCreation';
import BookedPrograms from './pages/clients/BookedPrograms';



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
        path="/booked-programs"
        element={
          <ProtectedRoute>
            <BookedPrograms />
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
          path="/trainer-create-program"
          element={
            <ProtectedRoute>
              <TrainerProgramCreation />
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
      <NutritionistProgramCreation />
    </ProtectedRoute>
  }
/>
      </Routes>
      </Router>
      
  );
}

export default App;