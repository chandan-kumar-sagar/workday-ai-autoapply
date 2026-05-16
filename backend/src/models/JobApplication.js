const mongoose = require(
  'mongoose'
);

const jobApplicationSchema =
  new mongoose.Schema(
    {
      company: {
        type: String,
      },

      role: {
        type: String,
      },

      status: {
        type: String,

        default: 'Applied',
      },

      appliedDate: {
        type: Date,

        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    'JobApplication',
    jobApplicationSchema
  );