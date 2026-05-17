const parseWithGroq = async (prompt) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }

    console.log(" Call Groq API with prompt length:", prompt.length);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Groq API returned an empty choices array");
    }

    const content = data.choices[0].message.content;
    console.log(" Groq API call successful!");
    return content;
  } catch (error) {
    console.error(" Groq Service Error:", error.message);
    throw error;
  }
};

module.exports = {
  parseWithGroq,
};
