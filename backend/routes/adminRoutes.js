const express = require("express");
const {
  listAdminMatches,
  updateDeadline,
  updateResult,
  listPredictionsForMatch,
} = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));
router.get("/matches", listAdminMatches);
router.patch("/matches/:id/deadline", updateDeadline);
router.patch("/matches/:id/result", updateResult);
router.get("/predictions/:matchId", listPredictionsForMatch);

module.exports = router;
