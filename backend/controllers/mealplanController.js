const MealPlan = require('../models/MealplanModel');

exports.createMealPlan = async (req, res) => {
  const { userId, weight, fitnessGoal, preferences } = req.body;

  // Generate a dummy meal plan (replace with actual logic)
  const mealPlan = [
    { meal: 'Breakfast', items: ['Oatmeal', 'Banana', 'Almonds'] },
    { meal: 'Lunch', items: ['Grilled Chicken', 'Brown Rice', 'Broccoli'] },
    { meal: 'Dinner', items: ['Salmon', 'Quinoa', 'Asparagus'] },
  ];

  try {
    const newMealPlan = await MealPlan.create({
      userId,
      weight,
      fitnessGoal,
      preferences,
      mealPlan,
    });
    res.status(201).json(newMealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating meal plan', error });
  }
};

exports.getMealPlans = async (req, res) => {
  const { userId } = req.params;
  try {
    const mealPlans = await MealPlan.find({ userId });
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal plans', error });
  }
};