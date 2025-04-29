// filepath: c:\Users\User\OneDrive\Desktop\Health-and-Fitness-Center\backend\server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Correct import
const cors = require('cors');
const paymentRoutes = require('./routes/PaymentRoutes')
const mealplanRoutes = require('./routes/mealplanRoutes');
const mealTrackerRoutes = require('./routes/mealTrackerRoutes'); // Import the new route
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));    
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', paymentRoutes);
app.use('/api/mealplans', mealplanRoutes);
app.use('/api/meal-tracker', mealTrackerRoutes); // Add the new route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));