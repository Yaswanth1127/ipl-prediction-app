const asyncHandler = require("../middlewares/asyncHandler");
const Prediction = require("../models/Prediction");

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Prediction.aggregate([
    {
      $group: {
        _id: "$userId",
        totalPoints: { $sum: "$points.total" },
        predictionCount: { $sum: 1 },
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
        email: "$user.email",
        totalPoints: 1,
        predictionCount: 1,
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
