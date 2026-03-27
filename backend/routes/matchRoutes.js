const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Get matches
router.get('/', async (req, res) => {
  const matches = await Match.find();
  res.json(matches);
});

module.exports = router;