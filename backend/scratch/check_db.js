require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Resume = require('../src/models/Resume');

async function check() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/workday-ai';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    const count = await Resume.countDocuments();
    console.log('Total Resumes in DB:', count);
    if (count > 0) {
      const latest = await Resume.findOne().sort({ createdAt: -1 });
      console.log('Latest Resume Data Keys:', Object.keys(latest.parsedData || {}));
      console.log('Latest Resume Name:', latest.parsedData?.name);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
