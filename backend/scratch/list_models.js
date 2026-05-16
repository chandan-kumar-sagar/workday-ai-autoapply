require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the client SDK like this usually, 
    // but we can try to fetch the models via the REST API or just try common ones.
    // Let's try 'gemini-1.5-pro-latest' or 'gemini-1.5-flash-latest'
    console.log('Trying gemini-1.5-flash-latest...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent('Say hello');
    console.log('Success with gemini-1.5-flash-latest:', result.response.text());
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

listModels();
