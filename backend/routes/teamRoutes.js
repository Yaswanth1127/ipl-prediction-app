const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all teams
router.get('/', async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

module.exports = router;