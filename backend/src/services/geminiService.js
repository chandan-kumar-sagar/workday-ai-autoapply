const genAI = require("../config/geminiConfig");


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const parseResumeWithGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error(
      "Gemini Resume Parsing Error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  parseResumeWithGemini,
};