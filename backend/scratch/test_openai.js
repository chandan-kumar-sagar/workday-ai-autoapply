require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  console.log('Testing OpenAI connection...');
  console.log('API Key present:', !!process.env.OPENAI_API_KEY);
  if (process.env.OPENAI_API_KEY) {
      console.log('API Key length:', process.env.OPENAI_API_KEY.length);
      console.log('API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 7));
      console.log('API Key ends with:', process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 5));
  }
  
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log('Response:', response.choices[0].message.content);
    console.log('Connection successful!');
  } catch (error) {
    console.error('Error Message:', error.message);
    if (error.status) console.error('Status:', error.status);
    if (error.code) console.error('Code:', error.code);
    if (error.type) console.error('Type:', error.type);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

test();
