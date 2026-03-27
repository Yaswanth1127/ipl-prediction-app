const asyncHandler = require("../middlewares/asyncHandler");
const Match = require("../models/Match");
const { deriveMatchStatus } = require("../services/matchService");

const serializeMatch = (match) => ({
  id: match._id,
  matchNo: match.matchNo,
  team1: match.team1,
  team2: match.team2,
  venue: match.venue,
  startTime: match.startTime,
  deadline: match.deadline,
  status: deriveMatchStatus(match),
  result: match.result,
  createdAt: match.createdAt,
  updatedAt: match.updatedAt,
});

const listMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find().sort({ startTime: 1 });
  res.json(matches.map(serializeMatch));
});

const getMatchById = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  res.json(serializeMatch(match));
});

module.exports = {
  listMatches,
  getMatchById,
  serializeMatch,
};
