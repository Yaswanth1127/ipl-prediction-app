require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', require('./routes/teamRoutes'));
const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("IPL Predictor API Running 🏏");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
console.log("Match route loaded ✅");