const podiumConfig = {
  1: {
    label: "1st Place",
    className: "first",
    accent: "League Leader",
  },
  2: {
    label: "2nd Place",
    className: "second",
    accent: "Closest Challenger",
  },
  3: {
    label: "3rd Place",
    className: "third",
    accent: "Podium Finish",
  },
};

const getRankBadge = (rank) => podiumConfig[rank] || null;

export default function LeaderboardTable({ rows }) {
  if (!rows.length) {
    return <div className="state-card">Leaderboard will appear after results are posted.</div>;
  }

  const podiumRows = rows.filter((row) => row.rank <= 3);

  return (
    <>
      {podiumRows.length ? (
        <section className="leaderboard-podium">
          {podiumRows.map((row) => {
            const badge = getRankBadge(row.rank);

            return (
              <article key={row.userId} className={`podium-card ${badge?.className || ""}`}>
                <span className={`place-badge ${badge?.className || ""}`}>{badge?.label || `#${row.rank}`}</span>
                <p className="eyebrow">{badge?.accent || "Friendly Rivalry"}</p>
                <h3>{row.name}</h3>
                <p className="podium-points">{row.totalPoints} pts</p>
                <p className="muted small-text">Average {row.averagePoints}</p>
              </article>
            );
          })}
        </section>
      ) : null}

      <div className="table-card leaderboard-table-card">
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
            {rows.map((row) => {
              const badge = getRankBadge(row.rank);

              return (
                <tr key={row.userId} className={badge ? `leaderboard-row ${badge.className}` : "leaderboard-row"}>
                  <td>
                    {badge ? <span className={`place-badge ${badge.className}`}>{badge.label}</span> : `#${row.rank}`}
                  </td>
                  <td>{row.name}</td>
                  <td>{row.totalPoints}</td>
                  <td>{row.averagePoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
