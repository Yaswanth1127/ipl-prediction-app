const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: String,
  shortName: String,
  captain: String,
  players: {
    batters: [String],
    wicketkeepers: [String],
    allRounders: [String],
    bowlers: [String]
  }
});

module.exports = mongoose.model("Team", teamSchema);