# Health and Fitness Center Application

## Overview
This project is a Health and Fitness Center application built using the MERN stack (MongoDB, Express, React, Node.js). It provides features for user profile management, service and booking management, meal planning, progress tracking, and a comprehensive dashboard.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **src/config/db.js**: Database connection configuration for MongoDB.
- **src/controllers**: Contains controllers for handling various functionalities:
  - `profileController.js`: User profile management.
  - `serviceController.js`: Fitness services and bookings management.
  - `mealController.js`: Meal planning and tracking.
  - `dashboardController.js`: Dashboard management.
- **src/models**: Defines MongoDB schemas:
  - `profileModel.js`: User profile schema.
  - `serviceModel.js`: Service schema.
  - `mealModel.js`: Meal plan schema.
  - `reportModel.js`: Report schema.
- **src/routes**: Exports routes for different functionalities:
  - `profileRoutes.js`: User profile routes.
  - `serviceRoutes.js`: Service and booking routes.
  - `mealRoutes.js`: Meal planning routes.
  - `dashboardRoutes.js`: Dashboard routes.
- **src/utils/helpers.js**: Utility functions for various operations.
- **src/server.js**: Entry point for the backend application.
- **package.json**: Backend project dependencies and scripts.
- **README.md**: Documentation for the backend project.

### Frontend
- **public/index.html**: Main HTML file for the React application.
- **src/components**: Contains React components for different functionalities:
  - `Profile/ProfileComponent.jsx`: User profile display and editing.
  - `Services/ServiceComponent.jsx`: Service display and booking.
  - `MealPlanning/MealComponent.jsx`: Meal planning and tracking.
  - `Dashboard/DashboardComponent.jsx`: User progress and notifications.
- **src/pages**: Main pages for the application:
  - `ProfilePage.jsx`: User profile management page.
  - `ServicePage.jsx`: Service browsing and booking page.
  - `MealPage.jsx`: Meal planning page.
  - `DashboardPage.jsx`: User dashboard page.
- **src/context/AppContext.js**: Global state management.
- **src/utils/api.js**: API call functions to the backend.
- **src/App.js**: Main application component.
- **src/index.js**: Entry point of the React application.
- **package.json**: Frontend project dependencies and scripts.
- **README.md**: Documentation for the frontend project.

## Getting Started
To get started with the application, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up the database connection in `src/config/db.js`.

4. Start the backend server:
   ```
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

6. Start the frontend application:
   ```
   npm start
   ```

## Features
- User Profile Management
- Service and Booking Management
- Meal Planning and Progress Tracking
- Dashboard with Notifications and Reports

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License.