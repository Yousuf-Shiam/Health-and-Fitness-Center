const Meal = require('../models/mealModel');

// Create a new meal plan
exports.createMealPlan = async (req, res) => {
    try {
        const mealPlan = new Meal(req.body);
        await mealPlan.save();
        res.status(201).json(mealPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all meal plans
exports.getMealPlans = async (req, res) => {
    try {
        const mealPlans = await Meal.find();
        res.status(200).json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a meal plan
exports.updateMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMealPlan = await Meal.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        res.status(200).json(updatedMealPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a meal plan
exports.deleteMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMealPlan = await Meal.findByIdAndDelete(id);
        if (!deletedMealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};