const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  team1: String,
  team2: String,
  date: Date,
  time: String,
  venue: String,
  deadline: Date,
  result: {
  winner: String,
  mostRuns: String,
  mostFours: String,
  mostSixes: String,
  mostWickets: String,
  playerOfMatch: String
}
});


module.exports = mongoose.model("Match", matchSchema);