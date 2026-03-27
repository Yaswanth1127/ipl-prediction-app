const POINT_RULES = {
  winner: 50,
  playerOfMatch: 30,
  mostRuns: 20,
  mostWickets: 20,
  mostFours: 15,
  mostSixes: 15,
};

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const calculatePoints = (prediction, result) => {
  const picks = prediction?.prediction || {};
  const actual = result || {};

  const breakdown = {
    winner:
      normalizeValue(picks.winner) && normalizeValue(picks.winner) === normalizeValue(actual.winner)
        ? POINT_RULES.winner
        : 0,
    playerOfMatch:
      normalizeValue(picks.playerOfMatch) &&
      normalizeValue(picks.playerOfMatch) === normalizeValue(actual.playerOfMatch)
        ? POINT_RULES.playerOfMatch
        : 0,
    mostRuns:
      normalizeValue(picks.mostRuns) && normalizeValue(picks.mostRuns) === normalizeValue(actual.mostRuns)
        ? POINT_RULES.mostRuns
        : 0,
    mostWickets:
      normalizeValue(picks.mostWickets) &&
      normalizeValue(picks.mostWickets) === normalizeValue(actual.mostWickets)
        ? POINT_RULES.mostWickets
        : 0,
    mostFours:
      normalizeValue(picks.mostFours) && normalizeValue(picks.mostFours) === normalizeValue(actual.mostFours)
        ? POINT_RULES.mostFours
        : 0,
    mostSixes:
      normalizeValue(picks.mostSixes) && normalizeValue(picks.mostSixes) === normalizeValue(actual.mostSixes)
        ? POINT_RULES.mostSixes
        : 0,
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return { total, breakdown };
};

module.exports = {
  POINT_RULES,
  calculatePoints,
};
