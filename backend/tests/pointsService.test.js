const test = require("node:test");
const assert = require("node:assert/strict");
const { calculatePoints, POINT_RULES } = require("../services/pointsService");

test("calculatePoints awards the configured totals", () => {
  const result = calculatePoints(
    {
      prediction: {
        winner: "RCB",
        playerOfMatch: "Virat Kohli",
        mostRuns: "Virat Kohli",
        mostWickets: "Hazlewood",
        mostFours: "Virat Kohli",
        mostSixes: "Maxwell",
      },
    },
    {
      winner: "RCB",
      playerOfMatch: "Virat Kohli",
      mostRuns: "Virat Kohli",
      mostWickets: "Hazlewood",
      mostFours: "Virat Kohli",
      mostSixes: "Russell",
    }
  );

  assert.equal(result.breakdown.winner, POINT_RULES.winner);
  assert.equal(result.breakdown.playerOfMatch, POINT_RULES.playerOfMatch);
  assert.equal(result.breakdown.mostRuns, POINT_RULES.mostRuns);
  assert.equal(result.breakdown.mostWickets, POINT_RULES.mostWickets);
  assert.equal(result.breakdown.mostFours, POINT_RULES.mostFours);
  assert.equal(result.breakdown.mostSixes, 0);
  assert.equal(result.total, 135);
});
