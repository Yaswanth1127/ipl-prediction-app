const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    prediction: {
      winner: { type: String, required: true, trim: true },
      mostRuns: { type: String, required: true, trim: true },
      mostFours: { type: String, required: true, trim: true },
      mostSixes: { type: String, required: true, trim: true },
      mostWickets: { type: String, required: true, trim: true },
      playerOfMatch: { type: String, required: true, trim: true },
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    points: {
      total: { type: Number, default: 0 },
      breakdown: {
        winner: { type: Number, default: 0 },
        playerOfMatch: { type: Number, default: 0 },
        mostRuns: { type: Number, default: 0 },
        mostWickets: { type: Number, default: 0 },
        mostFours: { type: Number, default: 0 },
        mostSixes: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

module.exports = mongoose.model("Prediction", predictionSchema);
