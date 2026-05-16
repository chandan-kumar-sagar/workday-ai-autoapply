const JobApplication = require(
  '../models/JobApplication'
);

// CREATE APPLICATION
const createApplication =
  async (req, res) => {
    try {
      const {
        company,
        role,
      } = req.body;

      const application =
        await JobApplication.create({
          company,
          role,
        });

      return res.status(201).json({
        success: true,

        application,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

// GET APPLICATIONS
const getApplications =
  async (req, res) => {
    try {
      const applications =
        await JobApplication.find().sort(
          {
            createdAt: -1,
          }
        );

      return res.status(200).json({
        success: true,

        applications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

module.exports = {
  createApplication,

  getApplications,
};