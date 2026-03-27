const express = require("express");
const { upsertPrediction, listMyPredictions } = require("../controllers/predictionController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/me", listMyPredictions);
router.put("/:matchId", upsertPrediction);

module.exports = router;
