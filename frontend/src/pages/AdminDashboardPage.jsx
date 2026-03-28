import { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import api from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";
import {
  formatDateTime,
  formatDateTimeLocalValue,
  parseIstDateTimeLocalValue,
} from "../utils/formatters";
import {
  defaultPredictionForm,
  getPredictionFieldOptions,
  predictionFieldLabels,
  predictionFieldOrder,
} from "../utils/predictionFields";

const PAGE_SIZE = 4;

const SelectField = ({ label, value, onChange, options }) => (
  <label>
    {label}
    <select value={value} onChange={onChange}>
      <option value="">Select {label}</option>
      {options.map((option) =>
        typeof option === "string" ? (
          <option key={option} value={option}>
            {option}
          </option>
        ) : (
          <optgroup key={option.label} label={option.label}>
            {option.options.map((player) => (
              <option key={`${option.label}-${player}`} value={player}>
                {player}
              </option>
            ))}
          </optgroup>
        )
      )}
    </select>
  </label>
);

export default function AdminDashboardPage() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matchPredictions, setMatchPredictions] = useState({});
  const [deadlineDrafts, setDeadlineDrafts] = useState({});
  const [resultDrafts, setResultDrafts] = useState({});
  const [editingPredictions, setEditingPredictions] = useState({});
  const [actionModal, setActionModal] = useState({ open: false, title: "", body: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const teamMap = useMemo(() => new Map(teams.map((team) => [team.shortName, team])), [teams]);

  const hydrateMatchData = (matchData) => {
    setMatches(matchData);
    setDeadlineDrafts(
      Object.fromEntries(matchData.map((match) => [match.id, formatDateTimeLocalValue(match.deadline)]))
    );
    setResultDrafts(
      Object.fromEntries(
        matchData.map((match) => [
          match.id,
          {
            ...defaultPredictionForm,
            ...match.result,
          },
        ])
      )
    );
  };

  const loadMatches = async () => {
    const { data } = await api.get("/admin/matches");
    hydrateMatchData(data);
  };

  useEffect(() => {
    const load = async () => {
      const [matchesResponse, teamsResponse] = await Promise.all([api.get("/admin/matches"), api.get("/teams")]);
      hydrateMatchData(matchesResponse.data);
      setTeams(teamsResponse.data);
    };

    load().catch((requestError) =>
      setError(getRequestErrorMessage(requestError, "Unable to load admin dashboard."))
    );
  }, []);

  const handleDeadlineUpdate = async (matchId) => {
    setError("");

    try {
      await api.patch(`/admin/matches/${matchId}/deadline`, {
        deadline: parseIstDateTimeLocalValue(deadlineDrafts[matchId]),
      });
      setActionModal({
        open: true,
        title: "Deadline Updated",
        body: "The prediction deadline was updated successfully and saved using IST timing.",
      });
      await loadMatches();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not update deadline."));
    }
  };

  const handleResultUpdate = async (matchId) => {
    setError("");

    try {
      await api.patch(`/admin/matches/${matchId}/result`, resultDrafts[matchId]);
      setActionModal({
        open: true,
        title: "Result Saved",
        body: "The official result was saved and all prediction points were recalculated successfully.",
      });
      await loadMatches();
      if (matchPredictions[matchId]) {
        await handleViewPredictions(matchId);
      }
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
      setEditingPredictions((current) => ({
        ...current,
        [matchId]: Object.fromEntries(
          data.map((entry) => [
            entry.id,
            {
              ...defaultPredictionForm,
              ...entry.prediction,
            },
          ])
        ),
      }));
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not load predictions."));
    }
  };

  const handlePredictionDraftChange = (matchId, predictionId, field, value) => {
    setEditingPredictions((current) => ({
      ...current,
      [matchId]: {
        ...(current[matchId] || {}),
        [predictionId]: {
          ...((current[matchId] || {})[predictionId] || defaultPredictionForm),
          [field]: value,
        },
      },
    }));
  };

  const handlePredictionUpdate = async (matchId, predictionId) => {
    setError("");

    try {
      const payload = editingPredictions[matchId]?.[predictionId];
      const { data } = await api.patch(`/admin/predictions/${predictionId}`, payload);

      setMatchPredictions((current) => ({
        ...current,
        [matchId]: (current[matchId] || []).map((entry) => (entry.id === predictionId ? data : entry)),
      }));
      setActionModal({
        open: true,
        title: "Prediction Updated",
        body: "The user prediction was updated successfully from the admin portal.",
      });
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not update prediction."));
    }
  };

  const handlePredictionDelete = async (matchId, predictionId) => {
    setError("");

    try {
      await api.delete(`/admin/predictions/${predictionId}`);
      setMatchPredictions((current) => ({
        ...current,
        [matchId]: (current[matchId] || []).filter((entry) => entry.id !== predictionId),
      }));
      setEditingPredictions((current) => ({
        ...current,
        [matchId]: Object.fromEntries(
          Object.entries(current[matchId] || {}).filter(([key]) => key !== predictionId)
        ),
      }));
      setActionModal({
        open: true,
        title: "Prediction Deleted",
        body: "The prediction was deleted successfully.",
      });
      await loadMatches();
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not delete prediction."));
    }
  };

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const paginatedMatches = matches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="stack-page">
      {actionModal.open ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setActionModal({ open: false, title: "", body: "" })}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Admin Update</p>
            <h3 id="admin-action-title">{actionModal.title}</h3>
            <p className="muted">{actionModal.body}</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setActionModal({ open: false, title: "", body: "" })}
            >
              Okay
            </button>
          </div>
        </div>
      ) : null}

      <header className="page-header">
        <div>
          <p className="eyebrow">Admin Portal</p>
          <h2>Match Management</h2>
          <p className="muted">Adjust deadlines in IST, post official results, and edit submitted predictions.</p>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <div className="card-stack">
        {paginatedMatches.map((match) => {
          const matchTeams = {
            team1: teamMap.get(match.team1),
            team2: teamMap.get(match.team2),
          };
          const predictionOptions = getPredictionFieldOptions(match, matchTeams);

          return (
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
                  <p className="muted small-text">This input is shown and saved using IST.</p>
                  <button type="button" className="secondary-button" onClick={() => handleDeadlineUpdate(match.id)}>
                    Update Deadline
                  </button>
                </div>

                <div className="card inset-card">
                  <h4>Post Result</h4>
                  <div className="prediction-grid compact">
                    {predictionFieldOrder.map((field) => (
                      <SelectField
                        key={field}
                        label={predictionFieldLabels[field]}
                        value={resultDrafts[match.id]?.[field] || ""}
                        onChange={(event) =>
                          setResultDrafts((current) => ({
                            ...current,
                            [match.id]: {
                              ...(current[match.id] || defaultPredictionForm),
                              [field]: event.target.value,
                            },
                          }))
                        }
                        options={predictionOptions[field]}
                      />
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

              {matchPredictions[match.id] ? (
                <div className="table-card predictions-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Total</th>
                        {predictionFieldOrder.map((field) => (
                          <th key={field}>{predictionFieldLabels[field]}</th>
                        ))}
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchPredictions[match.id].length ? (
                        matchPredictions[match.id].map((entry) => (
                          <tr key={entry.id}>
                            <td>
                              <strong>{entry.user.name}</strong>
                              <div className="muted small-text">{entry.user.email}</div>
                            </td>
                            <td>{entry.points.total}</td>
                            {predictionFieldOrder.map((field) => (
                              <td key={field}>
                                <select
                                  value={editingPredictions[match.id]?.[entry.id]?.[field] || ""}
                                  onChange={(event) =>
                                    handlePredictionDraftChange(match.id, entry.id, field, event.target.value)
                                  }
                                >
                                  <option value="">Select {predictionFieldLabels[field]}</option>
                                  {predictionOptions[field].map((option) =>
                                    typeof option === "string" ? (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ) : (
                                      <optgroup key={option.label} label={option.label}>
                                        {option.options.map((player) => (
                                          <option key={`${option.label}-${player}`} value={player}>
                                            {player}
                                          </option>
                                        ))}
                                      </optgroup>
                                    )
                                  )}
                                </select>
                              </td>
                            ))}
                            <td>{formatDateTime(entry.submittedAt)}</td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="secondary-button"
                                  onClick={() => handlePredictionUpdate(match.id, entry.id)}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="ghost-button"
                                  onClick={() => handlePredictionDelete(match.id, entry.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={predictionFieldOrder.length + 4}>No predictions submitted for this match yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
