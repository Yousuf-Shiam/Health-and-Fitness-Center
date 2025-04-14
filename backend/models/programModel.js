const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the program
      required: true,
    },
    role: {
      type: String,
      enum: ['trainer', 'nutritionist'], // Role of the creator
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
    clients: [
      {
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the client using the program
        },
        startDate: {
          type: Date, // Starting date of the program
        },
        startTime: {
          type: String, // Starting time of the program
        },
        status: {
          type: String,
          enum: ['active', 'completed', 'cancelled'], // Current status of the program
          default: 'active',
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Program = mongoose.model('Program', programSchema);

module.exports = Program;