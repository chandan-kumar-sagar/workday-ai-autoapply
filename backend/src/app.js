const express = require(
  'express'
);

const cors = require('cors');

const morgan = require(
  'morgan'
);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/resume',
  require('./routes/resumeRoutes')
);

app.use(
  '/api/automation',
  require('./routes/automationRoutes')
);

app.use(
  '/api/applications',
  require('./routes/applicationRoutes')
);

app.get('/', (req, res) => {
  res.json({
    message:
      'Workday AI Auto Apply API',
  });
});

module.exports = app;