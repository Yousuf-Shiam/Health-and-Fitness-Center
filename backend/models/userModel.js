const mongoose = require('mongoose');

// Define the User Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['client', 'trainer', 'nutritionist', 'admin'],
      default: 'client',
    },
    fitnessGoals: {
      type: String,
    },
    preferences: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);