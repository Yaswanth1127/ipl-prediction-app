import { useEffect, useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import api from "../services/api";

export default function LeaderboardPage({ portal }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/leaderboard");
        setRows(data);
      } catch (requestError) {
        setError("Unable to load leaderboard.");
      }
    };

    load();
  }, []);

  return (
    <div className="stack-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{portal === "admin" ? "Admin Portal" : "User Portal"}</p>
          <h2>Leaderboard</h2>
          <p className="muted">Track total points across the league.</p>
        </div>
      </header>
      {error ? <div className="error-banner">{error}</div> : <LeaderboardTable rows={rows} />}
    </div>
  );
}
