import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import api from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";
import { formatDateTime } from "../utils/formatters";
import { predictionFieldLabels, predictionFieldOrder } from "../utils/predictionFields";

const PAGE_SIZE = 6;

export default function MyPredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/predictions/me");
        setPredictions(data);
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, "Unable to load your predictions."));
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(predictions.length / PAGE_SIZE));
  const paginatedPredictions = predictions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="stack-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">User Portal</p>
          <h2>My Predictions</h2>
          <p className="muted">Review your submitted picks and points breakdown.</p>
        </div>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}
      {!predictions.length && !error ? <div className="state-card">You have not submitted any predictions yet.</div> : null}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <div className="card-stack">
        {paginatedPredictions.map((entry) => (
          <section key={entry.id} className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Match {entry.match?.matchNo}</p>
                <h3>
                  {entry.match?.team1} vs {entry.match?.team2}
                </h3>
                <p className="muted">
                  {entry.match?.venue} • Deadline {entry.match ? formatDateTime(entry.match.deadline) : ""}
                </p>
              </div>
              <div className="points-panel">
                <span>Total Points</span>
                <strong>{entry.points.total}</strong>
              </div>
            </div>

            <div className="summary-grid">
              {predictionFieldOrder.map((field) => (
                <div key={field} className="summary-item">
                  <span>{predictionFieldLabels[field]}</span>
                  <strong>{entry.prediction[field] || "-"}</strong>
                </div>
              ))}
            </div>

            <div className="summary-grid">
              {predictionFieldOrder.map((field) => (
                <div key={field} className="summary-item">
                  <span>Actual {predictionFieldLabels[field]}</span>
                  <strong>{entry.match?.result?.[field] || "Pending"}</strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
