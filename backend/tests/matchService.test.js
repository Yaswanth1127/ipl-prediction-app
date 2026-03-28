const test = require("node:test");
const assert = require("node:assert/strict");
const {
  deriveMatchStatus,
  isPredictionLocked,
  isTossLocked,
} = require("../services/matchService");

test("match timing uses separate toss and final prediction locks", () => {
  const match = {
    startTime: "2026-03-28T19:00:00.000Z",
    deadline: "2026-03-28T19:30:00.000Z",
    result: {},
  };

  assert.equal(isTossLocked(match, new Date("2026-03-28T18:59:59.000Z")), false);
  assert.equal(isTossLocked(match, new Date("2026-03-28T19:00:00.000Z")), true);

  assert.equal(isPredictionLocked(match, new Date("2026-03-28T19:29:59.000Z")), false);
  assert.equal(isPredictionLocked(match, new Date("2026-03-28T19:30:00.000Z")), true);

  assert.equal(deriveMatchStatus(match, new Date("2026-03-28T19:15:00.000Z")), "upcoming");
  assert.equal(deriveMatchStatus(match, new Date("2026-03-28T19:30:00.000Z")), "locked");
});
