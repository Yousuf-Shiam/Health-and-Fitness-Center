const User = require('../models/userModel');
const axios = require('axios');

// Edamam API Configuration
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/meal-planner/v1';

// Get environment variables (these will be available after dotenv.config() in server.js)
const getEdamamCredentials = () => ({
  appId: process.env.EDAMAM_APP_ID || 'your_app_id_here',
  appKey: process.env.EDAMAM_APP_KEY || 'your_app_key_here'
});

// Calculate BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

// BMI Category mapping
const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'underweight';
  if (bmi >= 18.5 && bmi < 25) return 'normal';
  if (bmi >= 25 && bmi < 30) return 'overweight';
  return 'obese';
};

// Get recommendations based on BMI and user data
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.height || !user.weight) {
      return res.status(400).json({ 
        message: 'Height and weight are required to generate recommendations. Please update your profile.' 
      });
    }

    // Calculate BMI
    const bmi = calculateBMI(user.weight, user.height);
    const bmiCategory = getBMICategory(parseFloat(bmi));

    // Update user's BMI in database
    await User.findByIdAndUpdate(userId, { bmi: parseFloat(bmi) });

    // Generate recommendations based on BMI category
    const recommendations = generateBMIBasedRecommendations(
      bmiCategory, 
      parseFloat(bmi), 
      user.age, 
      user.gender,
      user.fitnessGoals
    );

    // Try to get additional recommendations from external APIs
    let externalRecommendations = {};
    try {
      externalRecommendations = await getExternalRecommendations(
        bmiCategory, 
        user.age, 
        user.gender, 
        user.weight, 
        user.height
      );
    } catch (error) {
      console.error('External API call failed:', error.message);
    }

    const response = {
      user: {
        name: user.name,
        bmi: parseFloat(bmi),
        bmiCategory,
        height: user.height,
        weight: user.weight,
        age: user.age,
        gender: user.gender,
        fitnessGoals: user.fitnessGoals
      },
      recommendations: {
        ...recommendations,
        external: externalRecommendations
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Server error while generating recommendations' });
  }
};

// Generate internal recommendations based on BMI
const generateBMIBasedRecommendations = (bmiCategory, bmi, age, gender, fitnessGoals) => {
  const baseRecommendations = {
    underweight: {
      diet: [
        'Increase caloric intake with nutrient-dense foods',
        'Include healthy fats like avocados, nuts, and olive oil',
        'Eat frequent, smaller meals throughout the day',
        'Add protein-rich foods like lean meats, eggs, and legumes',
        'Consider weight-gain smoothies and shakes'
      ],
      exercise: [
        'Focus on strength training and resistance exercises',
        'Limit excessive cardio that burns too many calories',
        'Progressive overload weight training 3-4 times per week',
        'Include compound exercises like squats, deadlifts, bench press',
        'Allow adequate rest between workouts for muscle recovery'
      ],
      lifestyle: [
        'Ensure 7-9 hours of quality sleep',
        'Manage stress levels as it can suppress appetite',
        'Stay hydrated but avoid drinking too much before meals',
        'Consider consulting with a nutritionist',
        'Track your weight gain progress weekly'
      ]
    },
    normal: {
      diet: [
        'Maintain a balanced diet with all food groups',
        'Continue eating nutrient-dense whole foods',
        'Control portion sizes to maintain current weight',
        'Include plenty of fruits and vegetables',
        'Stay hydrated with 8-10 glasses of water daily'
      ],
      exercise: [
        'Mix of cardio and strength training exercises',
        '150 minutes of moderate aerobic activity per week',
        'Strength training exercises 2-3 times per week',
        'Include flexibility and balance exercises',
        'Try different activities to stay engaged'
      ],
      lifestyle: [
        'Maintain current healthy habits',
        'Continue regular health check-ups',
        'Monitor weight monthly to stay within healthy range',
        'Keep stress levels manageable',
        'Maintain good sleep hygiene'
      ]
    },
    overweight: {
      diet: [
        'Create a moderate caloric deficit (300-500 calories/day)',
        'Increase protein intake to preserve muscle mass',
        'Reduce processed foods and added sugars',
        'Increase fiber intake with vegetables and whole grains',
        'Practice portion control and mindful eating'
      ],
      exercise: [
        'Combine cardio and strength training',
        'Start with 30 minutes of moderate exercise 5 days/week',
        'Include HIIT workouts 2-3 times per week',
        'Strength training to maintain muscle mass',
        'Gradually increase exercise intensity and duration'
      ],
      lifestyle: [
        'Set realistic weight loss goals (1-2 lbs per week)',
        'Keep a food diary to track eating habits',
        'Get adequate sleep (7-9 hours) for hormone regulation',
        'Find healthy ways to manage stress',
        'Build a support system for accountability'
      ]
    },
    obese: {
      diet: [
        'Work with healthcare provider for safe weight loss plan',
        'Create moderate caloric deficit under professional guidance',
        'Focus on whole, unprocessed foods',
        'Increase protein and fiber intake',
        'Consider meal prep to control portions and ingredients'
      ],
      exercise: [
        'Start with low-impact activities like walking or swimming',
        'Begin with 10-15 minutes daily and gradually increase',
        'Include strength training as fitness improves',
        'Consider working with a qualified trainer',
        'Focus on consistency rather than intensity initially'
      ],
      lifestyle: [
        'Consult with healthcare providers regularly',
        'Set small, achievable goals',
        'Address emotional eating patterns',
        'Consider joining support groups',
        'Monitor progress with measurements, not just weight'
      ]
    }
  };

  let recommendations = baseRecommendations[bmiCategory];

  // Customize based on age
  if (age && age > 50) {
    recommendations.exercise.push('Include balance and flexibility exercises to prevent falls');
    recommendations.exercise.push('Consider lower-impact activities to protect joints');
    recommendations.diet.push('Ensure adequate calcium and vitamin D intake');
  }

  // Customize based on fitness goals
  if (fitnessGoals) {
    const goals = fitnessGoals.toLowerCase();
    if (goals.includes('muscle') || goals.includes('strength')) {
      recommendations.diet.push('Increase protein intake to 1.2-1.6g per kg body weight');
      recommendations.exercise.unshift('Prioritize progressive resistance training');
    }
    if (goals.includes('endurance') || goals.includes('cardio')) {
      recommendations.exercise.unshift('Focus on aerobic capacity building');
      recommendations.diet.push('Include complex carbohydrates for sustained energy');
    }
  }

  return recommendations;
};

// Get recommendations from external APIs (you can integrate with nutrition/fitness APIs)
const getExternalRecommendations = async (bmiCategory, age, gender, weight, height) => {
  try {
    // Get meal plan recommendations from Edamam
    const mealPlan = await getEdamamMealPlan(bmiCategory, age, gender, weight, height);
    
    // Get nutrition tips from various sources
    const nutritionTips = await getNutritionTips(bmiCategory);
    
    // Get exercise recommendations
    const exerciseTips = await getExerciseTips(bmiCategory, age, gender);

    return {
      mealPlan,
      nutritionTips,
      exerciseTips,
      supplementRecommendations: getSupplementRecommendations(bmiCategory, age, gender)
    };
  } catch (error) {
    console.error('Error fetching external recommendations:', error);
    return {
      error: 'External API temporarily unavailable',
      fallbackTips: getFallbackTips(bmiCategory)
    };
  }
};

// Get meal plan from Edamam API based on BMI category
const getEdamamMealPlan = async (bmiCategory, age, gender, weight, height) => {
  try {
    // Get credentials dynamically
    const { appId, appKey } = getEdamamCredentials();
    
    // Check if API credentials are properly configured
    if (appId === 'your_app_id_here' || appKey === 'your_app_key_here') {
      console.log('Edamam API credentials not configured, using enhanced fallback meal plans');
      throw new Error('API credentials not configured');
    }

    console.log('🧪 Attempting to use Edamam API...');
    console.log('App ID:', appId);
    console.log('BMI Category:', bmiCategory);
    console.log('Request URL:', EDAMAM_BASE_URL);

    // Calculate daily calorie needs based on BMI category and user data
    const dailyCalories = calculateDailyCalories(bmiCategory, age, gender, weight, height);
    
    // Determine health labels based on BMI category
    const healthLabels = getHealthLabels(bmiCategory);
    
    // Create meal plan request body
    const requestBody = {
      size: 7, // 7-day meal plan
      plan: {
        accept: {
          all: [
            {
              health: healthLabels
            }
          ]
        },
        fit: {
          ENERC_KCAL: {
            min: Math.floor(dailyCalories * 0.8),
            max: Math.floor(dailyCalories * 1.2)
          },
          SUGAR: {
            max: bmiCategory === 'obese' || bmiCategory === 'overweight' ? 25 : 50
          },
          NA: {
            max: bmiCategory === 'obese' || bmiCategory === 'overweight' ? 1500 : 2300
          }
        },
        sections: {
          Breakfast: {
            accept: {
              all: [
                {
                  dish: [
                    "cereals", "egg", "bread", "pancake", "drinks"
                  ]
                },
                {
                  meal: ["breakfast"]
                }
              ]
            },
            fit: {
              ENERC_KCAL: {
                min: Math.floor(dailyCalories * 0.2),
                max: Math.floor(dailyCalories * 0.3)
              }
            }
          },
          Lunch: {
            accept: {
              all: [
                {
                  dish: [
                    "main course", "salad", "soup", "sandwiches"
                  ]
                },
                {
                  meal: ["lunch/dinner"]
                }
              ]
            },
            fit: {
              ENERC_KCAL: {
                min: Math.floor(dailyCalories * 0.3),
                max: Math.floor(dailyCalories * 0.4)
              }
            }
          },
          Dinner: {
            accept: {
              all: [
                {
                  dish: [
                    "main course", "salad", "seafood"
                  ]
                },
                {
                  meal: ["lunch/dinner"]
                }
              ]
            },
            fit: {
              ENERC_KCAL: {
                min: Math.floor(dailyCalories * 0.3),
                max: Math.floor(dailyCalories * 0.4)
              }
            }
          }
        }
      }
    };

    // Make request to Edamam API
    // Correct URL format: just the base URL, credentials go in params
    const apiUrl = EDAMAM_BASE_URL;
    console.log('📤 Making request to:', apiUrl);
    console.log('📋 Request params:', { app_id: appId, app_key: appKey ? 'SET' : 'NOT SET' });
    
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Edamam-Account-User': 'demo-user'
      },
      params: {
        app_id: appId,
        app_key: appKey
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data && response.data.selection) {
      console.log('✅ SUCCESS: Edamam API returned meal plan data!');
      console.log('Days received:', response.data.selection.length);
      return {
        success: true,
        dailyCalories,
        mealPlan: formatMealPlan(response.data.selection),
        totalNutrients: response.data.selection[0]?.totalNutrients || {},
        message: 'Personalized meal plan generated successfully from Edamam API!'
      };
    } else {
      throw new Error('Invalid response from Edamam API');
    }

  } catch (error) {
    console.error('Edamam API Error:', error.message);
    
    // Return enhanced fallback meal suggestions
    return {
      success: false,
      error: error.message.includes('credentials') ? 
        'Edamam API credentials not configured. Using default meal suggestions.' : 
        'Unable to fetch personalized meal plan from external service.',
      fallbackMeals: getEnhancedFallbackMealPlan(bmiCategory, age, gender),
      dailyCalories: calculateDailyCalories(bmiCategory, age, gender, weight, height)
    };
  }
};

// Calculate daily calorie needs
const calculateDailyCalories = (bmiCategory, age, gender, weight, height) => {
  // Base Metabolic Rate calculation using Mifflin-St Jeor Equation
  let bmr;
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * (age || 25));
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * (age || 25));
  }

  // Activity level multiplier based on BMI category
  let activityMultiplier;
  switch (bmiCategory) {
    case 'underweight':
      activityMultiplier = 1.6; // More calories needed for weight gain
      break;
    case 'normal':
      activityMultiplier = 1.4; // Moderate activity
      break;
    case 'overweight':
      activityMultiplier = 1.3; // Slightly reduced for weight loss
      break;
    case 'obese':
      activityMultiplier = 1.2; // Lower for weight loss
      break;
    default:
      activityMultiplier = 1.4;
  }

  return Math.round(bmr * activityMultiplier);
};

// Get appropriate health labels for BMI category
const getHealthLabels = (bmiCategory) => {
  const baseLabels = ['balanced'];
  
  switch (bmiCategory) {
    case 'underweight':
      return [...baseLabels, 'high-protein'];
    case 'normal':
      return [...baseLabels, 'Mediterranean'];
    case 'overweight':
      return [...baseLabels, 'low-sodium', 'sugar-conscious'];
    case 'obese':
      return [...baseLabels, 'low-sodium', 'sugar-conscious', 'low-fat'];
    default:
      return baseLabels;
  }
};

// Format meal plan response
const formatMealPlan = (selection) => {
  try {
    return selection.map((day, index) => ({
      day: index + 1,
      meals: {
        breakfast: day.sections?.Breakfast?.assigned || 'No breakfast assigned',
        lunch: day.sections?.Lunch?.assigned || 'No lunch assigned',
        dinner: day.sections?.Dinner?.assigned || 'No dinner assigned'
      },
      totalCalories: day.totalNutrients?.ENERC_KCAL?.quantity || 0,
      totalProtein: day.totalNutrients?.PROCNT?.quantity || 0,
      totalCarbs: day.totalNutrients?.CHOCDF?.quantity || 0,
      totalFat: day.totalNutrients?.FAT?.quantity || 0
    }));
  } catch (error) {
    console.error('Error formatting meal plan:', error);
    return [];
  }
};

// Get enhanced fallback meal plan with detailed nutritional info
const getEnhancedFallbackMealPlan = (bmiCategory, age, gender) => {
  const mealPlans = {
    underweight: {
      breakfast: [
        'High-protein oatmeal with nuts, banana, and honey (450 cal)',
        'Whole grain toast with avocado, scrambled eggs, and cheese (520 cal)',
        'Greek yogurt parfait with granola, mixed berries, and almonds (480 cal)',
        'Protein smoothie with banana, peanut butter, and oats (500 cal)',
        'Whole grain pancakes with maple syrup and Greek yogurt (460 cal)',
        'Breakfast burrito with eggs, cheese, beans, and avocado (490 cal)',
        'Chia pudding with coconut milk, fruits, and nuts (440 cal)'
      ],
      lunch: [
        'Grilled chicken breast with quinoa salad and olive oil dressing (620 cal)',
        'Salmon fillet with sweet potato and steamed broccoli (580 cal)',
        'Turkey and hummus wrap with whole grain tortilla and veggies (560 cal)',
        'Lean beef stir-fry with brown rice and mixed vegetables (640 cal)',
        'Tuna salad sandwich on whole grain bread with side salad (590 cal)',
        'Chicken and vegetable curry with basmati rice (610 cal)',
        'Grilled portobello mushroom burger with sweet potato fries (570 cal)'
      ],
      dinner: [
        'Lean beef steak with roasted vegetables and quinoa (680 cal)',
        'Baked cod with herb butter, rice pilaf, and green beans (620 cal)',
        'Lentil curry with naan bread and cucumber raita (650 cal)',
        'Grilled chicken thigh with mashed sweet potatoes (640 cal)',
        'Turkey meatballs with pasta and marinara sauce (670 cal)',
        'Baked salmon with wild rice and asparagus (660 cal)',
        'Stuffed bell peppers with ground turkey and brown rice (630 cal)'
      ]
    },
    normal: {
      breakfast: [
        'Mediterranean veggie omelet with whole grain toast (320 cal)',
        'Smoothie bowl with mixed berries, granola, and chia seeds (340 cal)',
        'Whole grain cereal with milk, banana, and walnuts (310 cal)',
        'Greek yogurt with honey, granola, and fresh fruit (330 cal)',
        'Avocado toast with cherry tomatoes and feta cheese (350 cal)',
        'Steel-cut oats with cinnamon, apple, and almonds (320 cal)',
        'Veggie breakfast wrap with scrambled eggs and salsa (340 cal)'
      ],
      lunch: [
        'Grilled chicken Caesar salad with light dressing (420 cal)',
        'Vegetable soup with whole grain roll and side salad (380 cal)',
        'Quinoa Buddha bowl with mixed vegetables and tahini (450 cal)',
        'Turkey and avocado sandwich on whole grain bread (410 cal)',
        'Mediterranean chickpea salad with feta and olives (440 cal)',
        'Grilled fish tacos with cabbage slaw (430 cal)',
        'Lentil soup with mixed green salad (390 cal)'
      ],
      dinner: [
        'Grilled fish with steamed broccoli and brown rice (480 cal)',
        'Chicken and vegetable stir-fry with quinoa (460 cal)',
        'Mediterranean chickpea and vegetable stew (450 cal)',
        'Baked chicken breast with roasted vegetables (470 cal)',
        'Turkey chili with mixed beans and cornbread (490 cal)',
        'Grilled salmon with wild rice and green beans (485 cal)',
        'Vegetable curry with brown rice and yogurt (440 cal)'
      ]
    },
    overweight: {
      breakfast: [
        'Veggie egg white scramble with spinach and tomatoes (220 cal)',
        'Green smoothie with spinach, apple, and protein powder (240 cal)',
        'Steel-cut oats with berries and cinnamon (230 cal)',
        'Greek yogurt with fresh berries and a sprinkle of nuts (210 cal)',
        'Vegetable omelet with mushrooms and peppers (250 cal)',
        'Chia seed pudding with almond milk and berries (220 cal)',
        'Whole grain toast with tomato and cucumber (200 cal)'
      ],
      lunch: [
        'Large garden salad with grilled chicken and vinaigrette (350 cal)',
        'Vegetable soup with mixed greens and lemon dressing (280 cal)',
        'Zucchini noodles with turkey meatballs and marinara (320 cal)',
        'Grilled fish with large portion of steamed vegetables (340 cal)',
        'Chicken and vegetable stir-fry (no rice) (310 cal)',
        'Large mixed salad with chickpeas and olive oil (330 cal)',
        'Turkey lettuce wraps with vegetable filling (290 cal)'
      ],
      dinner: [
        'Grilled salmon with asparagus and cauliflower rice (380 cal)',
        'Cauliflower rice stir-fry with tofu and vegetables (350 cal)',
        'Baked chicken breast with large portion green beans (360 cal)',
        'Grilled white fish with roasted Brussels sprouts (340 cal)',
        'Turkey and vegetable soup with side salad (320 cal)',
        'Stuffed zucchini boats with ground turkey (370 cal)',
        'Grilled portobello mushrooms with mixed vegetables (310 cal)'
      ]
    },
    obese: {
      breakfast: [
        'Vegetable omelet with egg whites and minimal oil (180 cal)',
        'Chia seed pudding with unsweetened almond milk (160 cal)',
        'Green tea with mixed nuts (small portion) (150 cal)',
        'Greek yogurt (plain, low-fat) with berries (170 cal)',
        'Vegetable smoothie with protein powder (190 cal)',
        'Steel-cut oats (small portion) with cinnamon (160 cal)',
        'Cucumber and tomato salad with herb seasoning (120 cal)'
      ],
      lunch: [
        'Large salad with lean grilled chicken (no dressing) (280 cal)',
        'Broth-based vegetable soup with side salad (220 cal)',
        'Grilled chicken with large portion steamed vegetables (260 cal)',
        'Fish with mixed green salad and lemon (240 cal)',
        'Turkey and vegetable soup (portion controlled) (250 cal)',
        'Large portion of steamed vegetables with small piece of fish (230 cal)',
        'Chicken breast with cucumber and tomato salad (270 cal)'
      ],
      dinner: [
        'Baked fish with roasted Brussels sprouts and asparagus (320 cal)',
        'Turkey lettuce wraps with vegetables (280 cal)',
        'Vegetable curry with cauliflower rice (300 cal)',
        'Grilled chicken with large portion of green vegetables (310 cal)',
        'Baked cod with steamed broccoli and green beans (290 cal)',
        'Turkey and vegetable stir-fry (no rice) (300 cal)',
        'Large mixed vegetable salad with small portion grilled protein (270 cal)'
      ]
    }
  };

  const selectedPlan = mealPlans[bmiCategory] || mealPlans.normal;
  
  // Create a 7-day rotation
  const weekPlan = [];
  for (let day = 1; day <= 7; day++) {
    weekPlan.push({
      day: day,
      breakfast: selectedPlan.breakfast[(day - 1) % selectedPlan.breakfast.length],
      lunch: selectedPlan.lunch[(day - 1) % selectedPlan.lunch.length],
      dinner: selectedPlan.dinner[(day - 1) % selectedPlan.dinner.length]
    });
  }

  return {
    weeklyPlan: weekPlan,
    breakfast: selectedPlan.breakfast,
    lunch: selectedPlan.lunch,
    dinner: selectedPlan.dinner,
    totalOptions: selectedPlan.breakfast.length + selectedPlan.lunch.length + selectedPlan.dinner.length
  };
};

// Get nutrition tips from various sources
const getNutritionTips = async (bmiCategory) => {
  // This could integrate with other nutrition APIs or databases
  const tips = {
    underweight: [
      'Focus on calorie-dense, nutrient-rich foods',
      'Eat frequent, smaller meals throughout the day',
      'Include healthy fats like olive oil, nuts, and avocados',
      'Consider protein shakes between meals'
    ],
    normal: [
      'Maintain your current balanced eating pattern',
      'Continue including a variety of food groups',
      'Stay hydrated with plenty of water',
      'Practice mindful eating habits'
    ],
    overweight: [
      'Create a moderate caloric deficit',
      'Increase fiber intake to feel full longer',
      'Choose lean proteins and whole grains',
      'Limit processed foods and added sugars'
    ],
    obese: [
      'Work with a registered dietitian for personalized guidance',
      'Focus on portion control',
      'Increase vegetable intake significantly',
      'Consider meal prep to control ingredients'
    ]
  };

  return tips[bmiCategory] || tips.normal;
};

// Get exercise recommendations
const getExerciseTips = async (bmiCategory, age, gender) => {
  const tips = {
    underweight: [
      'Focus on strength training to build muscle mass',
      'Limit excessive cardio that burns too many calories',
      'Include resistance exercises 3-4 times per week',
      'Allow adequate rest for muscle recovery'
    ],
    normal: [
      'Maintain a balanced mix of cardio and strength training',
      'Aim for 150 minutes of moderate aerobic activity weekly',
      'Include flexibility exercises like yoga',
      'Try different activities to stay motivated'
    ],
    overweight: [
      'Combine cardio and strength training',
      'Start with low-impact exercises if needed',
      'Gradually increase intensity and duration',
      'Include HIIT workouts 2-3 times per week'
    ],
    obese: [
      'Start with low-impact activities like walking or swimming',
      'Begin slowly and gradually increase activity',
      'Consider working with a qualified fitness professional',
      'Focus on consistency rather than intensity'
    ]
  };

  return tips[bmiCategory] || tips.normal;
};

// Get supplement recommendations
const getSupplementRecommendations = (bmiCategory, age, gender) => {
  const supplements = {
    underweight: ['Protein powder', 'Creatine', 'Multivitamin', 'Omega-3 fatty acids'],
    normal: ['Multivitamin', 'Vitamin D', 'Omega-3 fatty acids'],
    overweight: ['Green tea extract', 'Fiber supplement', 'Multivitamin', 'Omega-3 fatty acids'],
    obese: ['Fiber supplement', 'Multivitamin', 'Omega-3 fatty acids', 'Probiotics']
  };

  return supplements[bmiCategory] || supplements.normal;
};

// Get fallback tips when external APIs fail
const getFallbackTips = (bmiCategory) => {
  return {
    nutritionTips: [
      'Consult with a registered dietitian for personalized advice',
      'Focus on whole, unprocessed foods',
      'Stay hydrated throughout the day'
    ],
    exerciseTips: [
      'Start slowly and gradually increase activity',
      'Find activities you enjoy to stay consistent',
      'Listen to your body and rest when needed'
    ]
  };
};

// Update user profile with height, weight, etc.
const updateUserPhysicalData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { height, weight, age, gender } = req.body;

    if (!height || !weight) {
      return res.status(400).json({ message: 'Height and weight are required' });
    }

    const bmi = calculateBMI(weight, height);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: age ? parseInt(age) : undefined,
        gender,
        bmi: parseFloat(bmi)
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Physical data updated successfully',
      user: {
        height: updatedUser.height,
        weight: updatedUser.weight,
        age: updatedUser.age,
        gender: updatedUser.gender,
        bmi: updatedUser.bmi,
        bmiCategory: getBMICategory(updatedUser.bmi)
      }
    });
  } catch (error) {
    console.error('Error updating user physical data:', error);
    res.status(500).json({ message: 'Server error while updating physical data' });
  }
};

module.exports = {
  getRecommendations,
  updateUserPhysicalData,
  calculateBMI,
  getBMICategory
};
