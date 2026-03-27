const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

router.get('/', async (req, res) => {
  const leaderboard = await Prediction.aggregate([
    {
      $group: {
        _id: "$userId",
        totalPoints: { $sum: "$points" }
      }
    },
    { $sort: { totalPoints: -1 } }
  ]);

  res.json(leaderboard);
});

module.exports = router;