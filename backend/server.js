// filepath: c:\Users\User\OneDrive\Desktop\Health-and-Fitness-Center\backend\server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Correct import
const cors = require('cors');
const paymentRoutes = require('./routes/PaymentRoutes')
const mealplanRoutes = require('./routes/mealplanRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const mealRoutes = require('./routes/mealRoutes'); // Import mealRoutes
const workoutRoutes = require('./routes/workoutRoutes'); // Import workoutRoutes
const recommendationRoutes = require('./routes/recommendationRoutes'); // Import recommendationRoutes

dotenv.config();

// Debug: Check if .env variables are loaded
console.log('🔍 Server Environment Check:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('EDAMAM_APP_ID:', process.env.EDAMAM_APP_ID || 'NOT LOADED');
console.log('EDAMAM_APP_KEY:', process.env.EDAMAM_APP_KEY ? 'Set' : 'NOT LOADED');
console.log('Current working directory:', process.cwd());

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
app.use('/api/notifications', notificationRoutes);
app.use('/api/meals', mealRoutes); // Register mealRoutes
app.use('/api/workouts', workoutRoutes); // Register workoutRoutes
app.use('/api/recommendations', recommendationRoutes); // Register recommendationRoutes



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
