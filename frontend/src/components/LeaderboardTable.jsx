export default function LeaderboardTable({ rows }) {
  if (!rows.length) {
    return <div className="state-card">Leaderboard will appear after results are posted.</div>;
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.totalPoints}</td>
              <td>{row.averagePoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
