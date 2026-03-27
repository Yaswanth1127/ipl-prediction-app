const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const calculatePoints = require('../utils/calculatePoints');

router.post('/result/:matchId', async (req, res) => {
  const match = await Match.findById(req.params.matchId);

  match.result = req.body;
  await match.save();

  const predictions = await Prediction.find({ matchId: match._id });

  for (let p of predictions) {
    const points = calculatePoints(p, match.result);
    p.points = points;
    await p.save();
  }

  res.json({ message: "Results updated & points calculated" });
});

module.exports = router;