require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log('Testing Gemini connection...');
  console.log('API Key present:', !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('No GEMINI_API_KEY found in .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  try {
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    console.log('Response:', response.text());
    console.log('Connection successful!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
