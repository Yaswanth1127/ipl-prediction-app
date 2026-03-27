const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getLeaderboard);

module.exports = router;
