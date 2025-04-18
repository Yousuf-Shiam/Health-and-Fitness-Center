// filepath: c:\Users\User\OneDrive\Desktop\Health-and-Fitness-Center\backend\server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Correct import
const cors = require('cors');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));