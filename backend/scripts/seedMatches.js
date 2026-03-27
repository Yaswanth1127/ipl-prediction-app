require("../config/env");
const connectDb = require("../config/db");
const Match = require("../models/Match");
const { matchSeedData } = require("./matchData");

const seedMatches = async () => {
  await connectDb();
  await Match.deleteMany({});
  await Match.insertMany(matchSeedData);
  console.log("Seeded IPL matches.");
  process.exit(0);
};

seedMatches().catch((error) => {
  console.error(error);
  process.exit(1);
});
