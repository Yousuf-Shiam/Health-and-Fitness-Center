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
import NutritionistProgramCreation from './pages/nutritionists/NutritionistProgramCreation';
import TrainerProfile from './pages/trainers/TrainerProfile';
import TrainerProgramCreation from './pages/trainers/TrainerProgramCreation';
import BookedPrograms from './pages/clients/BookedPrograms';
import BookedProjects from './pages/nutritionists/bookedProjects';
import Payment from './pages/clients/Payment';
import DemoPayment from './pages/clients/DemoPayment';
import CreateMealPlan from './pages/clients/createmealplan';
import Mealplan from './pages/clients/Mealplan';
import MealTracking from './pages/clients/mealtracking'; // Import the MealTracking component
import FitnessTracking from './pages/clients/fitnesstracking'; // Import the FitnessTracking component
import MealPlanReview from './pages/nutritionists/mealPlanReview';
import Notifications from './pages/clients/Notifications';
import BookedTrainings from './pages/trainers/bookedTrainings';
import AdminLogin from './pages/admin/adminLogin';
import AdminDashboard from './pages/admin/admin';

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
        <Route path="/payment" element={<Payment />} />
        <Route path="/demo-payment" element={<DemoPayment />} />
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
            <ProtectedRoute>
              <TrainerProfile />
            </ProtectedRoute>
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
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route
          path="/nutritionist-create-program"
          element={
            <ProtectedRoute>
              <NutritionistProgramCreation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionist-booked-projects"
          element={
            <ProtectedRoute>
              <BookedProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-meal-plan"
          element={
            <ProtectedRoute>
              <CreateMealPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mealplans"
          element={
            <ProtectedRoute>
              <Mealplan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal-tracking"
          element={
            <ProtectedRoute>
              <MealTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fitness-tracking"
          element={
            <ProtectedRoute>
              <FitnessTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionist-mealplan-review"
          element={
            <ProtectedRoute>
              <MealPlanReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer-booked-trainings"
          element={
            <ProtectedRoute>
              <BookedTrainings />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;