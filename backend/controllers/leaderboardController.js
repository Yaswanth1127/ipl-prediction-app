const asyncHandler = require("../middlewares/asyncHandler");
const Prediction = require("../models/Prediction");

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Prediction.aggregate([
    {
      $group: {
        _id: "$userId",
        totalPoints: { $sum: "$points.total" },
        predictionCount: { $sum: 1 },
        averagePoints: { $avg: "$points.total" },
      },
    },
    { $sort: { totalPoints: -1, predictionCount: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        totalPoints: 1,
        predictionCount: 1,
        averagePoints: { $round: ["$averagePoints", 2] },
      },
    },
  ]);

  res.json(
    leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }))
  );
});

module.exports = {
  getLeaderboard,
};
