const express = require("express");
const { listMatches, getMatchById } = require("../controllers/matchController");

const router = express.Router();

router.get("/", listMatches);
router.get("/:id", getMatchById);

module.exports = router;
