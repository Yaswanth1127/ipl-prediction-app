const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    winner: { type: String, trim: true, default: "" },
    tossWinner: { type: String, trim: true, default: "" },
    mostRuns: { type: String, trim: true, default: "" },
    mostFours: { type: String, trim: true, default: "" },
    mostSixes: { type: String, trim: true, default: "" },
    mostWickets: { type: String, trim: true, default: "" },
    playerOfMatch: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    matchNo: {
      type: Number,
      required: true,
      unique: true,
    },
    team1: {
      type: String,
      required: true,
      trim: true,
    },
    team2: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "locked", "completed"],
      default: "upcoming",
    },
    result: {
      type: resultSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);
