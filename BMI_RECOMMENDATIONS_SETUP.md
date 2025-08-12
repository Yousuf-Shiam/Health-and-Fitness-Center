# BMI-Based Recommendation System with Edamam Integration

This system provides personalized health and meal recommendations based on user BMI calculations and integrates with the Edamam Meal Planning API for real meal suggestions.

## Features

### 🎯 Core Features
- **BMI Calculation**: Automatic BMI calculation based on height and weight
- **Personalized Recommendations**: Diet, exercise, and lifestyle recommendations based on BMI category
- **Meal Planning**: Integration with Edamam API for personalized meal plans
- **Calorie Calculation**: Daily calorie needs calculation using Mifflin-St Jeor Equation
- **Comprehensive Dashboard**: User-friendly interface displaying all recommendations

### 📊 BMI Categories Supported
- **Underweight** (BMI < 18.5): Focus on weight gain and muscle building
- **Normal Weight** (BMI 18.5-24.9): Maintenance and balanced nutrition
- **Overweight** (BMI 25-29.9): Weight loss and portion control
- **Obese** (BMI ≥ 30): Structured weight loss with professional guidance

## API Integration

### Edamam Meal Planning API
The system integrates with Edamam's Meal Planning API to provide:
- 7-day personalized meal plans
- Calorie-appropriate meals for each BMI category
- Nutritional information for each meal
- Health label filtering (low-sodium, sugar-conscious, etc.)

## Setup Instructions

### 1. Get Edamam API Credentials
1. Visit [Edamam Developer Portal](https://developer.edamam.com/)
2. Sign up for a free account
3. Create a new application
4. Select "Meal Planner API"
5. Copy your APP_ID and APP_KEY

### 2. Configure Environment Variables
Update your `.env` file in the backend directory:
```
EDAMAM_APP_ID=your_actual_app_id_here
EDAMAM_APP_KEY=your_actual_app_key_here
```

### 3. Install Dependencies
```bash
cd backend
npm install axios
```

### 4. Database Schema Updates
The user model now includes additional fields:
- `height`: Number (cm)
- `weight`: Number (kg)
- `bmi`: Number (calculated)
- `age`: Number
- `gender`: String (male/female/other)

## API Endpoints

### GET `/api/recommendations/bmi-recommendations`
Returns comprehensive recommendations including:
- BMI calculation and category
- Diet recommendations
- Exercise recommendations
- Lifestyle recommendations
- Personalized meal plan (if Edamam API is available)
- Nutrition and supplement suggestions

### PUT `/api/recommendations/physical-data`
Updates user's physical information:
```json
{
  "height": 175,
  "weight": 70,
  "age": 25,
  "gender": "male"
}
```

## Frontend Features

### BMI Dashboard (`/bmi-recommendations`)
- **Physical Data Form**: Update height, weight, age, gender
- **BMI Display**: Large, color-coded BMI value with category
- **Recommendation Cards**: Organized sections for different types of recommendations
- **Meal Plan Display**: 7-day meal plan with nutritional information
- **Error Handling**: Fallback recommendations when APIs are unavailable

### Navigation Integration
- Added "BMI & Health Tips" button to client navigation
- Protected route requiring authentication
- Responsive design matching existing app theme

## Recommendation Algorithm

### Calorie Calculation
Uses Mifflin-St Jeor Equation:
- **Men**: BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
- **Women**: BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)

Activity multipliers based on BMI category:
- Underweight: 1.6 (more calories for weight gain)
- Normal: 1.4 (moderate activity)
- Overweight: 1.3 (slight reduction for weight loss)
- Obese: 1.2 (lower for weight loss)

### Health Labels Selection
Based on BMI category, the system automatically selects appropriate Edamam health labels:
- **Underweight**: balanced, high-protein
- **Normal**: balanced, Mediterranean
- **Overweight**: balanced, low-sodium, sugar-conscious
- **Obese**: balanced, low-sodium, sugar-conscious, low-fat

## Error Handling & Fallbacks

### API Failure Handling
- Fallback meal suggestions when Edamam API is unavailable
- Default nutrition and exercise tips
- User-friendly error messages
- Graceful degradation of features

### Data Validation
- Input validation for height (100-250 cm) and weight (30-300 kg)
- Age validation (13-100 years)
- Gender selection validation
- BMI calculation error handling

## Usage Instructions

### For Users
1. **Profile Update**: Navigate to BMI & Health Tips from the sidebar
2. **Enter Physical Data**: Add height, weight, age, and gender
3. **View Recommendations**: Get personalized diet, exercise, and meal recommendations
4. **Update Data**: Modify physical information anytime to get updated recommendations

### For Developers
1. **API Integration**: Replace demo API keys with real Edamam credentials
2. **Customization**: Modify recommendation algorithms in `recommendationController.js`
3. **UI Enhancement**: Update styles and components in `BMIRecommendations.js`
4. **Additional APIs**: Integrate more health and fitness APIs for enhanced recommendations

## Security Considerations
- All API endpoints are protected with JWT authentication
- User data is stored securely in MongoDB
- Environment variables protect sensitive API keys
- Input validation prevents invalid data submission

## Future Enhancements
- Integration with fitness tracking APIs
- Meal plan export functionality
- Progress tracking over time
- Social features for sharing achievements
- Professional consultation booking
- Grocery list generation from meal plans

## Troubleshooting

### Common Issues
1. **API Errors**: Check that Edamam API credentials are correctly set
2. **Missing Data**: Ensure height and weight are provided before getting recommendations
3. **Network Issues**: System falls back to default recommendations when APIs are unavailable
4. **Authentication**: Verify JWT token is valid and user is logged in

### Testing
- Test with different BMI categories to see varied recommendations
- Verify fallback behavior when API is unavailable
- Check responsive design on different screen sizes
- Validate form input handling and error messages
