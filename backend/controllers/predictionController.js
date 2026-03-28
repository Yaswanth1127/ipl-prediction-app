const asyncHandler = require("../middlewares/asyncHandler");
const Match = require("../models/Match");
const Prediction = require("../models/Prediction");
const {
  PREDICTION_FIELDS,
  NON_TOSS_PREDICTION_FIELDS,
  buildFieldPayload,
  hasAllFields,
} = require("../constants/predictionFields");
const { calculatePoints } = require("../services/pointsService");
const {
  deriveMatchStatus,
  isPredictionLocked,
  isTossLocked,
} = require("../services/matchService");

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
        result: prediction.matchId.result,
      }
    : undefined,
});

const upsertPrediction = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.matchId);

  if (!match) {
    return res.status(404).json({ message: "Match not found." });
  }

  if (isPredictionLocked(match)) {
    return res.status(400).json({ message: "Prediction deadline has passed." });
  }

  let prediction = await Prediction.findOne({
    userId: req.user._id,
    matchId: match._id,
  });

  const predictionPayload = buildFieldPayload(PREDICTION_FIELDS, req.body);
  const tossLocked = isTossLocked(match);

  if (tossLocked) {
    if (!prediction?.prediction?.tossWinner) {
      return res.status(400).json({
        message: "Toss prediction is locked. Save your toss winner before the match starts.",
      });
    }

    if (
      typeof req.body?.tossWinner !== "undefined" &&
      String(req.body.tossWinner || "").trim() !== prediction.prediction.tossWinner
    ) {
      return res.status(400).json({
        message: "Toss winner cannot be changed after the match starts.",
      });
    }

    predictionPayload.tossWinner = prediction.prediction.tossWinner;

    if (!hasAllFields(NON_TOSS_PREDICTION_FIELDS, predictionPayload)) {
      return res.status(400).json({ message: "All remaining prediction fields are required." });
    }
  } else if (!hasAllFields(PREDICTION_FIELDS, predictionPayload)) {
    return res.status(400).json({ message: "All prediction fields are required." });
  }

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
