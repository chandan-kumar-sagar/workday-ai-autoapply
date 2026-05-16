const resumePrompt = (resumeText) => {
  return `
You are an expert AI resume parser.

Extract structured JSON from the resume.

Return ONLY valid JSON.

Required format:

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "skills": ["skill1", "skill2"],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "certifications": ["cert1"]
}

Resume Text:
${resumeText}
`;
};

module.exports = resumePrompt;