const Resume = require("../models/Resume");

const STATIC_FIELD_MAP = {
  "how did you hear about us": "LinkedIn", "source": "LinkedIn",
  "first name": "Chandan", "given name": "Chandan",
  "last name": "Kumar", "family name": "Kumar", "surname": "Kumar",
  "email": "yourmail@gmail.com",
  "phone": "9876543210", "mobile": "9876543210",
  "city": "Bangalore", "current city": "Bangalore",
  "country": "India",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "github": "https://github.com/yourgithub",
  "portfolio": "https://yourportfolio.com",
  "current company": "Self Employed", "current employer": "Self Employed",
  "notice period": "Immediate",
  "gender": "Male",
  "work authorization": "Yes", "authorized to work": "Yes",
  "require sponsorship": "No", "visa sponsorship": "No",
  "experience": "2",
  "current ctc": "600000", "expected ctc": "900000",
};

const findStaticValue = (label) => {
  const lower = label.toLowerCase();

  for (const key in STATIC_FIELD_MAP) {
    if (lower.includes(key)) {
      return STATIC_FIELD_MAP[key];
    }
  }

  return "";
};

const mapField = async (req, res) => {
  try {
    const { fieldLabel } = req.body;

    if (!fieldLabel) {
      return res.status(400).json({
        success: false,
        message: "Field label missing",
      });
    }

    console.log("🔍 Mapping Field:", fieldLabel);

    const latestResume = await Resume.findOne().sort({
      createdAt: -1,
    });

    if (latestResume) {
      const parsed = latestResume.parsedData || {};
      const labelLower = fieldLabel.toLowerCase();

      if (parsed.education && parsed.education.length > 0) {
        const edu = parsed.education[0];
        if (labelLower.includes("school") || labelLower.includes("university") || labelLower.includes("institution")) {
          return res.status(200).json({ success: true, result: { value: edu.institution, confidence: 0.9 } });
        }
        if (labelLower.includes("degree")) {
          return res.status(200).json({ success: true, result: { value: edu.degree, confidence: 0.9 } });
        }
        if (labelLower.includes("field of study") || labelLower.includes("major")) {
          return res.status(200).json({ success: true, result: { value: edu.degree, confidence: 0.8 } });
        }
        if (labelLower.includes("year") || labelLower.includes("graduat") || labelLower.includes("to (actual or expected)")) {
          return res.status(200).json({ success: true, result: { value: edu.year, confidence: 0.8 } });
        }
      }

      if (parsed.experience && parsed.experience.length > 0) {
        const exp = parsed.experience[0];
        if (labelLower.includes("company") || labelLower.includes("employer")) {
          return res.status(200).json({ success: true, result: { value: exp.company, confidence: 0.9 } });
        }
        if (labelLower.includes("title") || labelLower.includes("role")) {
          return res.status(200).json({ success: true, result: { value: exp.role, confidence: 0.9 } });
        }
        if (labelLower.includes("description") || labelLower.includes("responsibilities")) {
          return res.status(200).json({ success: true, result: { value: exp.description, confidence: 0.9 } });
        }
      }

      for (const key of Object.keys(parsed)) {
        if (typeof parsed[key] === "string" && labelLower.includes(key.toLowerCase())) {
          return res.status(200).json({
            success: true,
            result: { value: parsed[key], confidence: 0.8 },
          });
        }
      }

      if (labelLower.includes("skill") && Array.isArray(parsed.skills)) {
        return res.status(200).json({ success: true, result: { value: parsed.skills.join(", "), confidence: 0.9 } });
      }
    }

    const staticValue = findStaticValue(fieldLabel);

    if (staticValue) {
      console.log(" Static Match:", staticValue);

      return res.status(200).json({
        success: true,
        result: {
          value: staticValue,
          confidence: 1,
        },
      });
    }

    try {
      const { parseResumeWithGemini } = require("../services/geminiService");
      
      const resumeContent = latestResume ? latestResume.rawText : "No resume data available. Use general professional knowledge.";
      
      const aiPrompt = `
        Resume Content: ${resumeContent}
        Field to fill: ${fieldLabel}
        
        Generate a concise, professional answer for this field based on the resume (if provided). 
        If it's a "Why are you a fit" question, write 2-3 sentences. 
        If it's a salary question, estimate based on experience or return a reasonable number like 80000.
        Return ONLY the value.
      `;
      
      const aiValue = await parseResumeWithGemini(aiPrompt);
      
      if (aiValue && aiValue.length < 500) {
        return res.status(200).json({
          success: true,
          result: { value: aiValue.trim(), confidence: 0.7 }
        });
      }
    } catch (aiErr) {
      console.log("AI Fallback Error:", aiErr.message);
    }

    return res.status(200).json({
      success: true,
      result: {
        value: "",
        confidence: 0,
      },
    });
  } catch (error) {
    console.log("Map Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  mapField,
};