// Test script to verify Edamam API integration
const axios = require('axios');

const EDAMAM_APP_ID = '7bb50200';
const EDAMAM_APP_KEY = '1f9b9633d89c6a3022855f37ef63c78e';
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/meal-planner/v1';

async function testEdamamAPI() {
  try {
    console.log('🧪 Testing Edamam API integration...');
    console.log('App ID:', EDAMAM_APP_ID);
    console.log('Base URL:', EDAMAM_BASE_URL);

    const requestBody = {
      size: 1, // Just 1 day for testing
      plan: {
        accept: {
          all: [
            {
              health: ['balanced']
            }
          ]
        },
        fit: {
          ENERC_KCAL: {
            min: 1500,
            max: 2000
          }
        },
        sections: {
          Breakfast: {
            accept: {
              all: [
                {
                  dish: ['cereals', 'egg', 'bread']
                },
                {
                  meal: ['breakfast']
                }
              ]
            },
            fit: {
              ENERC_KCAL: {
                min: 300,
                max: 500
              }
            }
          }
        }
      }
    };

    console.log('📤 Sending request to Edamam...');

    const response = await axios.post(`${EDAMAM_BASE_URL}/${EDAMAM_APP_ID}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Edamam-Account-User': 'test-user'
      },
      params: {
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY
      },
      timeout: 15000
    });

    console.log('✅ API Response received!');
    console.log('Status:', response.status);
    console.log('Response preview:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');

    if (response.data && response.data.selection) {
      console.log('🎉 SUCCESS: Edamam API is working correctly!');
      console.log('Number of meal plan days received:', response.data.selection.length);
    } else {
      console.log('⚠️  WARNING: Unexpected response format');
    }

  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Error message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);

    if (error.response?.status === 401) {
      console.log('🔑 Authentication issue - check your APP_ID and APP_KEY');
    } else if (error.response?.status === 403) {
      console.log('🚫 Access forbidden - verify your plan supports Meal Planner API');
    } else if (error.response?.status === 429) {
      console.log('⏰ Rate limit exceeded - wait before making more requests');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 Network issue - check internet connection');
    }
  }
}

// Run the test
testEdamamAPI();
