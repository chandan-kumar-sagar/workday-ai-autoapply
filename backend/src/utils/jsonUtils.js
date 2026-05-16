/**
 * Clean JSON string from AI response (removes markdown code blocks)
 * @param {string} text 
 * @returns {string}
 */
const cleanAIJson = (text) => {
  if (!text) return '{}';
  
  // 1. Try to extract content between ```json and ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = text.match(codeBlockRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // 2. If no code block, try to find the first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }
  
  return text.trim();
};

module.exports = {
  cleanAIJson,
};
