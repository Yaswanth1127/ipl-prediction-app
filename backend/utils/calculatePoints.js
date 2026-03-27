const calculatePoints = (prediction, result) => {
  let points = 0;

  if (prediction.winner === result.winner) points += 30;
  if (prediction.playerOfMatch === result.playerOfMatch) points += 50;
  if (prediction.mostRuns === result.mostRuns) points += 50;
  if (prediction.mostWickets === result.mostWickets) points += 20;
  if (prediction.mostFours === result.mostFours) points += 25;
  if (prediction.mostSixes === result.mostSixes) points += 25;

  return points;
};

module.exports = calculatePoints;