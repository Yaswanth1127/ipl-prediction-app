import { useState } from "react";
import API from "../services/api";

function PredictionForm({ matchId }) {
  const [form, setForm] = useState({
    winner: "",
    mostRuns: "",
    mostFours: "",
    mostSixes: "",
    mostWickets: "",
    playerOfMatch: ""
  });

  const handleSubmit = async () => {
    await API.post("/predictions", {
      matchId,
      userId: "user1", // temporary
      ...form
    });

    alert("Prediction submitted ✅");
  };

  return (
    <div>
      <h4>Make Prediction</h4>

      <input placeholder="Winner" onChange={e => setForm({...form, winner: e.target.value})} />
      <input placeholder="Most Runs" onChange={e => setForm({...form, mostRuns: e.target.value})} />
      <input placeholder="Most Fours" onChange={e => setForm({...form, mostFours: e.target.value})} />
      <input placeholder="Most Sixes" onChange={e => setForm({...form, mostSixes: e.target.value})} />
      <input placeholder="Most Wickets" onChange={e => setForm({...form, mostWickets: e.target.value})} />
      <input placeholder="Player of Match" onChange={e => setForm({...form, playerOfMatch: e.target.value})} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default PredictionForm;