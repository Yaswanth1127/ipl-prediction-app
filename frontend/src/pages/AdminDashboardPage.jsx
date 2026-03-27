import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import api from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";
import { formatDateTime } from "../utils/formatters";

const PAGE_SIZE = 4;

const emptyResult = {
  winner: "",
  playerOfMatch: "",
  mostRuns: "",
  mostWickets: "",
  mostFours: "",
  mostSixes: "",
};

export default function AdminDashboardPage() {
  const [matches, setMatches] = useState([]);
  const [matchPredictions, setMatchPredictions] = useState({});
  const [deadlineDrafts, setDeadlineDrafts] = useState({});
  const [resultDrafts, setResultDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadMatches = async () => {
    const { data } = await api.get("/admin/matches");
    setMatches(data);
    setDeadlineDrafts(
      Object.fromEntries(data.map((match) => [match.id, new Date(match.deadline).toISOString().slice(0, 16)]))
    );
    setResultDrafts(
      Object.fromEntries(
        data.map((match) => [
          match.id,
          {
            ...emptyResult,
            ...match.result,
          },
        ])
      )
    );
  };

  useEffect(() => {
    loadMatches().catch((requestError) =>
      setError(getRequestErrorMessage(requestError, "Unable to load admin dashboard."))
    );
  }, []);

  const handleDeadlineUpdate = async (matchId) => {
    setMessage("");
    setError("");

    try {
      await api.patch(`/admin/matches/${matchId}/deadline`, {
        deadline: deadlineDrafts[matchId],
      });
      setMessage("Deadline updated.");
      await loadMatches();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not update deadline."));
    }
  };

  const handleResultUpdate = async (matchId) => {
    setMessage("");
    setError("");

    try {
      await api.patch(`/admin/matches/${matchId}/result`, resultDrafts[matchId]);
      setMessage("Results posted and points recalculated.");
      await loadMatches();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not post result."));
    }
  };

  const handleViewPredictions = async (matchId) => {
    setError("");

    try {
      const { data } = await api.get(`/admin/predictions/${matchId}`);
      setMatchPredictions((current) => ({
        ...current,
        [matchId]: data,
      }));
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not load predictions."));
    }
  };

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const paginatedMatches = matches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="stack-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Admin Portal</p>
          <h2>Match Management</h2>
          <p className="muted">Adjust deadlines, post final results, and inspect submitted predictions.</p>
        </div>
      </header>

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <div className="card-stack">
        {paginatedMatches.map((match) => (
          <section key={match.id} className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Match {match.matchNo}</p>
                <h3>
                  {match.team1} vs {match.team2}
                </h3>
                <p className="muted">
                  {match.venue} • Start {formatDateTime(match.startTime)} • Status {match.status}
                </p>
              </div>
              <div className="points-panel">
                <span>Predictions</span>
                <strong>{match.predictionCount}</strong>
              </div>
            </div>

            <div className="admin-grid">
              <div className="card inset-card">
                <h4>Edit Deadline</h4>
                <label>
                  Prediction Deadline
                  <input
                    type="datetime-local"
                    value={deadlineDrafts[match.id] || ""}
                    onChange={(event) =>
                      setDeadlineDrafts((current) => ({
                        ...current,
                        [match.id]: event.target.value,
                      }))
                    }
                  />
                </label>
                <button type="button" className="secondary-button" onClick={() => handleDeadlineUpdate(match.id)}>
                  Update Deadline
                </button>
              </div>

              <div className="card inset-card">
                <h4>Post Result</h4>
                <div className="prediction-grid compact">
                  {Object.keys(emptyResult).map((field) => (
                    <label key={field}>
                      {field}
                      <input
                        value={resultDrafts[match.id]?.[field] || ""}
                        onChange={(event) =>
                          setResultDrafts((current) => ({
                            ...current,
                            [match.id]: {
                              ...(current[match.id] || emptyResult),
                              [field]: event.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>
                <button type="button" className="primary-button" onClick={() => handleResultUpdate(match.id)}>
                  Save Result
                </button>
              </div>
            </div>

            <div className="card-footer">
              <button type="button" className="ghost-button" onClick={() => handleViewPredictions(match.id)}>
                View Submitted Predictions
              </button>
            </div>

            {matchPredictions[match.id]?.length ? (
              <div className="table-card">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Total</th>
                      <th>Winner</th>
                      <th>Player of the Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchPredictions[match.id].map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.user.name}</td>
                        <td>{entry.user.email}</td>
                        <td>{entry.points.total}</td>
                        <td>{entry.prediction.winner}</td>
                        <td>{entry.prediction.playerOfMatch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
