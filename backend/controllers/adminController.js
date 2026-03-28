const asyncHandler = require("../middlewares/asyncHandler");
const Match = require("../models/Match");
const Prediction = require("../models/Prediction");
const {
  PREDICTION_FIELDS,
  RESULT_FIELDS,
  buildFieldPayload,
  hasAllFields,
} = require("../constants/predictionFields");
const { calculatePoints } = require("../services/pointsService");
const { deriveMatchStatus } = require("../services/matchService");
const { serializeMatch } = require("./matchController");

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

  const result = buildFieldPayload(RESULT_FIELDS, req.body);

  if (!hasAllFields(RESULT_FIELDS, result)) {
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
  const match = await Match.findById(req.params.matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  const predictions = await Prediction.find({ matchId: req.params.matchId })
    .populate("userId", "name email role")
    .sort({ "points.total": -1, submittedAt: 1 });

  res.json(
    predictions.map((prediction) => ({
      id: prediction._id,
      user: prediction.userId,
      matchId: prediction.matchId,
      prediction: prediction.prediction,
      points: prediction.points,
      submittedAt: prediction.submittedAt,
      lockedAt: prediction.lockedAt,
      result: match.result,
    }))
  );
});

const updatePredictionForMatch = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.predictionId)
    .populate("userId", "name email role")
    .populate("matchId");

  if (!prediction) {
    return res.status(404).json({ message: "Prediction not found." });
  }

  const payload = buildFieldPayload(PREDICTION_FIELDS, req.body);

  if (!hasAllFields(PREDICTION_FIELDS, payload)) {
    return res.status(400).json({ message: "All prediction fields are required." });
  }

  prediction.prediction = payload;
  prediction.submittedAt = new Date();
  prediction.points = calculatePoints(prediction, prediction.matchId?.result);
  await prediction.save();

  res.json({
    id: prediction._id,
    user: prediction.userId,
    matchId: prediction.matchId?._id || prediction.matchId,
    prediction: prediction.prediction,
    points: prediction.points,
    submittedAt: prediction.submittedAt,
    lockedAt: prediction.lockedAt,
    result: prediction.matchId?.result || {},
  });
});

const deletePredictionForMatch = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.predictionId);

  if (!prediction) {
    return res.status(404).json({ message: "Prediction not found." });
  }

  await prediction.deleteOne();

  res.json({ message: "Prediction deleted." });
});

module.exports = {
  listAdminMatches,
  updateDeadline,
  updateResult,
  listPredictionsForMatch,
  updatePredictionForMatch,
  deletePredictionForMatch,
};
