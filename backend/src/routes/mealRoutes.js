const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

// Route to create a new meal plan
router.post('/meal', mealController.createMealPlan);

// Route to get all meal plans
router.get('/meals', mealController.getAllMealPlans);

// Route to get a specific meal plan by ID
router.get('/meal/:id', mealController.getMealPlanById);

// Route to update a meal plan by ID
router.put('/meal/:id', mealController.updateMealPlan);

// Route to delete a meal plan by ID
router.delete('/meal/:id', mealController.deleteMealPlan);

module.exports = router;