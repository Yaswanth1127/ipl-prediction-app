const asyncHandler = require("../middlewares/asyncHandler");
const Match = require("../models/Match");
const Prediction = require("../models/Prediction");
const { calculatePoints } = require("../services/pointsService");
const { deriveMatchStatus } = require("../services/matchService");

const requiredFields = [
  "winner",
  "mostRuns",
  "mostFours",
  "mostSixes",
  "mostWickets",
  "playerOfMatch",
];

const buildPredictionPayload = (body) =>
  requiredFields.reduce((acc, field) => {
    acc[field] = String(body[field] || "").trim();
    return acc;
  }, {});

const validatePredictionPayload = (payload) => requiredFields.every((field) => payload[field]);

const serializePrediction = (prediction) => ({
  id: prediction._id,
  matchId: prediction.matchId?._id || prediction.matchId,
  userId: prediction.userId?._id || prediction.userId,
  prediction: prediction.prediction,
  submittedAt: prediction.submittedAt,
  lockedAt: prediction.lockedAt,
  points: prediction.points,
  match: prediction.matchId?.team1
    ? {
        id: prediction.matchId._id,
        matchNo: prediction.matchId.matchNo,
        team1: prediction.matchId.team1,
        team2: prediction.matchId.team2,
        venue: prediction.matchId.venue,
        startTime: prediction.matchId.startTime,
        deadline: prediction.matchId.deadline,
        status: deriveMatchStatus(prediction.matchId),
      }
    : undefined,
});

const upsertPrediction = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  if (new Date() > new Date(match.deadline)) {
    return res.status(400).json({ message: "Prediction deadline has passed." });
  }

  const predictionPayload = buildPredictionPayload(req.body);

  if (!validatePredictionPayload(predictionPayload)) {
    return res.status(400).json({ message: "All prediction fields are required." });
  }

  let prediction = await Prediction.findOne({
    userId: req.user._id,
    matchId: match._id,
  });

  const calculatedPoints = calculatePoints({ prediction: predictionPayload }, match.result);

  if (!prediction) {
    prediction = await Prediction.create({
      userId: req.user._id,
      matchId: match._id,
      prediction: predictionPayload,
      submittedAt: new Date(),
      points: calculatedPoints,
    });
    return res.status(201).json(serializePrediction(prediction));
  }

  prediction.prediction = predictionPayload;
  prediction.submittedAt = new Date();
  prediction.points = calculatedPoints;
  await prediction.save();

  res.json(serializePrediction(prediction));
});

const listMyPredictions = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ userId: req.user._id })
    .populate("matchId")
    .sort({ createdAt: -1 });

  res.json(predictions.map(serializePrediction));
});

module.exports = {
  upsertPrediction,
  listMyPredictions,
};
