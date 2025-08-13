const mongoose = require('mongoose');

const programSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // Duration in weeks
      required: true,
    },
    goals: {
      type: String,
    },
    role: {
      type: String,
      enum: ['trainer', 'nutritionist'], // Role of the creator
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the program
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);