const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Match = require('../models/Match');

// Submit prediction
router.post('/', async (req, res) => {
  const { matchId } = req.body;

  const match = await Match.findById(matchId);

  // ⏰ deadline check
  if (new Date() > new Date(match.deadline)) {
    return res.status(400).json({ message: "Prediction closed ❌" });
  }

  const prediction = await Prediction.create(req.body);

  res.json(prediction);
});

module.exports = router;