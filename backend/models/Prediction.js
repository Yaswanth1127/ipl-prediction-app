const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: String,
  matchId: String,

  winner: String,
  mostRuns: String,
  mostFours: String,
  mostSixes: String,
  mostWickets: String,
  playerOfMatch: String,

  points: { type: Number, default: 0 }
});

module.exports = mongoose.model("Prediction", predictionSchema);