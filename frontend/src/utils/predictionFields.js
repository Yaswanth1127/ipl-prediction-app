export const predictionFieldOrder = [
  "winner",
  "tossWinner",
  "playerOfMatch",
  "mostRuns",
  "mostWickets",
  "mostFours",
  "mostSixes",
];

export const predictionFieldLabels = {
  winner: "Winner",
  tossWinner: "Toss Winner",
  playerOfMatch: "Player of the Match",
  mostRuns: "Most Runs",
  mostWickets: "Most Wickets",
  mostFours: "Most Fours",
  mostSixes: "Most Sixes",
};

export const defaultPredictionForm = predictionFieldOrder.reduce((acc, field) => {
  acc[field] = "";
  return acc;
}, {});

export const getUniquePlayers = (...groups) =>
  [...new Set(groups.flat().filter(Boolean))].sort((a, b) => a.localeCompare(b));

export const getGroupedPlayerOptions = (match, teams) => {
  const team1Players = teams.team1?.players || {};
  const team2Players = teams.team2?.players || {};

  return [
    {
      label: teams.team1?.name || match.team1,
      options: getUniquePlayers(
        teams.team1?.captain,
        team1Players.batters || [],
        team1Players.wicketkeepers || [],
        team1Players.allRounders || [],
        team1Players.bowlers || []
      ),
    },
    {
      label: teams.team2?.name || match.team2,
      options: getUniquePlayers(
        teams.team2?.captain,
        team2Players.batters || [],
        team2Players.wicketkeepers || [],
        team2Players.allRounders || [],
        team2Players.bowlers || []
      ),
    },
  ].filter((group) => group.options.length);
};

export const getGroupedWicketOptions = (match, teams) => {
  const team1Players = teams.team1?.players || {};
  const team2Players = teams.team2?.players || {};

  return [
    {
      label: teams.team1?.name || match.team1,
      options: getUniquePlayers(
        teams.team1?.captain,
        team1Players.bowlers || [],
        team1Players.allRounders || []
      ),
    },
    {
      label: teams.team2?.name || match.team2,
      options: getUniquePlayers(
        teams.team2?.captain,
        team2Players.bowlers || [],
        team2Players.allRounders || []
      ),
    },
  ].filter((group) => group.options.length);
};

export const getPredictionFieldOptions = (match, teams) => {
  const groupedAllPlayers = getGroupedPlayerOptions(match, teams);
  const groupedWicketOptions = getGroupedWicketOptions(match, teams);
  const teamOptions = [match.team1, match.team2];

  return {
    winner: teamOptions,
    tossWinner: teamOptions,
    playerOfMatch: groupedAllPlayers,
    mostRuns: groupedAllPlayers,
    mostWickets: groupedWicketOptions.length ? groupedWicketOptions : groupedAllPlayers,
    mostFours: groupedAllPlayers,
    mostSixes: groupedAllPlayers,
  };
};
