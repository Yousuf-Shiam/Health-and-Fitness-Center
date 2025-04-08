const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    dietaryPreferences: {
        type: String,
        required: true
    },
    mealItems: [{
        name: {
            type: String,
            required: true
        },
        calories: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        },
        carbs: {
            type: Number,
            required: true
        },
        fats: {
            type: Number,
            required: true
        }
    }],
    totalCalories: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;