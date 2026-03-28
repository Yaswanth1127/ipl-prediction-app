const test = require("node:test");
const assert = require("node:assert/strict");
const { deriveMatchStatus } = require("../services/matchService");

test("match timing locks once the prediction deadline is reached", () => {
  const match = {
    startTime: "2026-03-28T19:30:00.000Z",
    deadline: "2026-03-28T19:30:00.000Z",
    result: {},
  };

  assert.equal(deriveMatchStatus(match, new Date("2026-03-28T19:15:00.000Z")), "upcoming");
  assert.equal(deriveMatchStatus(match, new Date("2026-03-28T19:30:00.000Z")), "locked");
});
