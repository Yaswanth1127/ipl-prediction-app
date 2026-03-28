const express = require("express");
const {
  listAdminMatches,
  updateDeadline,
  updateResult,
  clearResult,
  listPredictionsForMatch,
  updatePredictionForMatch,
  deletePredictionForMatch,
} = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));
router.get("/matches", listAdminMatches);
router.patch("/matches/:id/deadline", updateDeadline);
router.patch("/matches/:id/result", updateResult);
router.delete("/matches/:id/result", clearResult);
router.get("/predictions/:matchId", listPredictionsForMatch);
router.patch("/predictions/:predictionId", updatePredictionForMatch);
router.delete("/predictions/:predictionId", deletePredictionForMatch);

module.exports = router;
