const asyncHandler = require("../middlewares/asyncHandler");
const Match = require("../models/Match");
const Prediction = require("../models/Prediction");
const { calculatePoints } = require("../services/pointsService");
const { deriveMatchStatus } = require("../services/matchService");
const { serializeMatch } = require("./matchController");

const requiredResultFields = [
  "winner",
  "mostRuns",
  "mostFours",
  "mostSixes",
  "mostWickets",
  "playerOfMatch",
];

const listAdminMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find().sort({ startTime: 1 });
  const predictionCounts = await Prediction.aggregate([
    { $group: { _id: "$matchId", count: { $sum: 1 } } },
  ]);

  const predictionMap = new Map(predictionCounts.map((item) => [item._id.toString(), item.count]));

  res.json(
    matches.map((match) => ({
      ...serializeMatch(match),
      predictionCount: predictionMap.get(match._id.toString()) || 0,
    }))
  );
});

const updateDeadline = asyncHandler(async (req, res) => {
  const { deadline } = req.body;
  const match = await Match.findById(req.params.id);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  if (!deadline) {
    return res.status(400).json({ message: "Deadline is required." });
  }

  match.deadline = new Date(deadline);
  match.status = deriveMatchStatus(match);
  await match.save();

  res.json(serializeMatch(match));
});

const updateResult = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  const result = requiredResultFields.reduce((acc, field) => {
    acc[field] = String(req.body[field] || "").trim();
    return acc;
  }, {});

  if (!requiredResultFields.every((field) => result[field])) {
    return res.status(400).json({ message: "All result fields are required." });
  }

  match.result = result;
  match.status = "completed";
  await match.save();

  const predictions = await Prediction.find({ matchId: match._id });

  for (const prediction of predictions) {
    prediction.points = calculatePoints(prediction, match.result);
    if (!prediction.lockedAt) {
      prediction.lockedAt = new Date(match.deadline);
    }
    await prediction.save();
  }

  res.json({
    message: "Results saved and leaderboard recalculated.",
    match: serializeMatch(match),
  });
});

const listPredictionsForMatch = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ matchId: req.params.matchId })
    .populate("userId", "name email role")
    .sort({ "points.total": -1, submittedAt: 1 });

  res.json(
    predictions.map((prediction) => ({
      id: prediction._id,
      user: prediction.userId,
      prediction: prediction.prediction,
      points: prediction.points,
      submittedAt: prediction.submittedAt,
      lockedAt: prediction.lockedAt,
    }))
  );
});

module.exports = {
  listAdminMatches,
  updateDeadline,
  updateResult,
  listPredictionsForMatch,
};
