const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const connectDb = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "IPL Predictor API running." });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/predictions", require("./routes/predictionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

app.use(errorMiddleware);

const startServer = async () => {
  await connectDb();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = app;
