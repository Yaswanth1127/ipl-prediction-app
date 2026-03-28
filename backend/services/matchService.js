const isTossLocked = (matchLike, now = new Date()) =>
  new Date(matchLike.startTime) <= now;

const isPredictionLocked = (matchLike, now = new Date()) =>
  new Date(matchLike.deadline) <= now;

const deriveMatchStatus = (matchLike, now = new Date()) => {
  const result = matchLike?.result || {};
  const hasResult = [
    result.winner,
    result.tossWinner,
    result.playerOfMatch,
    result.mostRuns,
    result.mostWickets,
    result.mostFours,
    result.mostSixes,
  ].some(Boolean);

  if (hasResult) {
    return "completed";
  }

  if (isPredictionLocked(matchLike, now)) {
    return "locked";
  }

  return "upcoming";
};

module.exports = {
  deriveMatchStatus,
  isPredictionLocked,
  isTossLocked,
};
