const PREDICTION_FIELDS = [
  "winner",
  "tossWinner",
  "playerOfMatch",
  "mostRuns",
  "mostWickets",
  "mostFours",
  "mostSixes",
];

const RESULT_FIELDS = [...PREDICTION_FIELDS];

const FIELD_LABELS = {
  winner: "Winner",
  tossWinner: "Toss Winner",
  playerOfMatch: "Player of the Match",
  mostRuns: "Most Runs",
  mostWickets: "Most Wickets",
  mostFours: "Most Fours",
  mostSixes: "Most Sixes",
};

const buildFieldPayload = (fields, body) =>
  fields.reduce((acc, field) => {
    acc[field] = String(body?.[field] || "").trim();
    return acc;
  }, {});

const hasAllFields = (fields, payload) => fields.every((field) => payload[field]);

module.exports = {
  PREDICTION_FIELDS,
  RESULT_FIELDS,
  FIELD_LABELS,
  buildFieldPayload,
  hasAllFields,
};
