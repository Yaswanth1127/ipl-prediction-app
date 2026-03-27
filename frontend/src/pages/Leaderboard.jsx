import { useEffect, useState } from "react";
import API from "../services/api";

function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/leaderboard").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Leaderboard 🏆</h2>

      {data.map((user, index) => (
        <div key={index}>
          <p>User: {user._id}</p>
          <p>Points: {user.totalPoints}</p>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;