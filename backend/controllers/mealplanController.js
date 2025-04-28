exports.createMealPlan = async (req, res) => {
  const { userId, weight, fitnessGoal, preferences, mealPlan } = req.body;
  console.log('Request Body:', req.body); // Debugging request body

  try {
    const newMealPlan = await MealPlan.create({
      userId,
      weight,
      fitnessGoal,
      preferences,
      mealPlan,
    });
    console.log('New Meal Plan:', newMealPlan); // Debugging created meal plan
    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ message: 'Error creating meal plan', error });
  }
};