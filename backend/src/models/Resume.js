const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rawText: { type: String },
    resumeUrl: { type: String },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      skills: [String],
      education: [{ degree: String, institution: String, year: String }],
      experience: [{ company: String, role: String, duration: String, description: mongoose.Schema.Types.Mixed }],
      certifications: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);