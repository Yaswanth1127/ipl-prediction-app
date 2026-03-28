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

  if (new Date(matchLike.deadline) <= now) {
    return "locked";
  }

  return "upcoming";
};

module.exports = {
  deriveMatchStatus,
};
