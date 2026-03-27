import { useEffect, useState } from "react";
import API from "../services/api";
import PredictionForm from "../components/PredictionForm"; // ✅ IMPORT

function Dashboard() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    API.get("/matches").then(res => setMatches(res.data));
  }, []);

  return (
    <div>
      <h2>IPL Matches</h2>

      {matches.map(match => (
        <div
          key={match._id}
          style={{ border: "1px solid black", margin: 10, padding: 10 }}
        >
          {/* MATCH INFO */}
          <h3>{match.team1} vs {match.team2}</h3>
          <p>{match.date} - {match.time}</p>

          {/* ✅ STEP 5 CODE HERE */}
          <PredictionForm matchId={match._id} />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;