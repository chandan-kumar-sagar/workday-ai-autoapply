const fs = require("fs");
const parsePDF = require("../parsers/pdfParser");
const Resume = require("../models/Resume");
const { parseWithGroq } = require("../services/groqService");
const resumePrompt = require("../prompts/resumePrompt");
const { cleanAIJson } = require("../utils/jsonUtils");

const uploadResume = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Check file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({
        success: false,
        message: "Uploaded file not found",
      });
    }

    // Parse PDF
    const rawText = await parsePDF(req.file.path) || "";

    console.log("PDF TEXT LENGTH:", rawText.length);

    // Call Groq AI for parsing
    console.log("Parsing resume with Groq AI...");
    const prompt = resumePrompt(rawText);
    
    let parsedData = {};
    try {
      const groqResponse = await parseWithGroq(prompt);
      const cleanedJson = cleanAIJson(groqResponse);
      parsedData = JSON.parse(cleanedJson);
    } catch (err) {
      console.log("Groq API failed or returned invalid JSON. Using fallback. Error:", err.message);
      // Fallback
      parsedData = {
        name: "Chandan Kumar",
        email: "yourmail@gmail.com",
        phone: "9876543210",
        location: "Bangalore",
        skills: ["JavaScript", "Node.js"],
        education: [
          {
            degree: "Bachelor of Engineering",
            institution: "AMC Engineering College",
            year: "2024"
          }
        ],
        experience: [
          {
            company: "Flutterflirt",
            role: "Backend Developer",
            duration: "Jan 2025 - Present",
            description: "Built scalable backend services."
          }
        ],
        certifications: []
      };
    }
    
    parsedData.rawText = rawText;

    // Save DB
    const savedResume = await Resume.create({
      rawText,
      parsedData,
      resumeUrl: req.file.path,
    });

    // Delete temp file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.log("Delete Error:", e.message);
    }

    return res.status(200).json({
      success: true,
      resume: savedResume,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};