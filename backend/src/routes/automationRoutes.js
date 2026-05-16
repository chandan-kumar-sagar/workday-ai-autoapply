const express = require('express');
const router = express.Router();
const { mapField } = require('../controllers/automationController');

router.post('/map-field', mapField);

module.exports = router;