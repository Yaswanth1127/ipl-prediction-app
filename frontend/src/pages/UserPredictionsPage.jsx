import { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import PredictionCard from "../components/PredictionCard";
import TeamTicker from "../components/TeamTicker";
import api from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";
import { getDateKeyInIst } from "../utils/formatters";

const PAGE_SIZE = 1;

const isUpcomingOrToday = (match) => new Date(match.startTime) >= new Date(new Date().setHours(0, 0, 0, 0));
const getMatchDateKey = (match) => getDateKeyInIst(match.startTime);
const pickFirstMatchPerDay = (matches) => {
  const seen = new Set();

  return matches.filter((match) => {
    const key = getMatchDateKey(match);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export default function UserPredictionsPage() {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingMatchId, setSavingMatchId] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [saveModal, setSaveModal] = useState({ open: false, isUpdate: false });

  useEffect(() => {
    const load = async () => {
      try {
        const [matchesResponse, predictionsResponse, teamsResponse] = await Promise.all([
          api.get("/matches"),
          api.get("/predictions/me"),
          api.get("/teams"),
        ]);
        setMatches(matchesResponse.data);
        setPredictions(predictionsResponse.data);
        setTeams(teamsResponse.data);
      } catch (requestError) {
        setError(getRequestErrorMessage(requestError, "Unable to load matches right now."));
      }
    };

    load();
  }, []);

  const predictionMap = useMemo(
    () => new Map(predictions.map((prediction) => [String(prediction.matchId), prediction])),
    [predictions]
  );

  const teamMap = useMemo(() => new Map(teams.map((team) => [team.shortName, team])), [teams]);
  const upcomingMatches = useMemo(
    () =>
      pickFirstMatchPerDay(
        matches
          .filter((match) => isUpcomingOrToday(match))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      ),
    [matches]
  );
  const completedMatches = useMemo(
    () =>
      pickFirstMatchPerDay(
        matches
          .filter((match) => !isUpcomingOrToday(match))
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      ),
    [matches]
  );
  const upcomingTotalPages = Math.max(1, Math.ceil(upcomingMatches.length / PAGE_SIZE));
  const completedTotalPages = Math.max(1, Math.ceil(completedMatches.length / PAGE_SIZE));
  const paginatedUpcomingMatches = useMemo(() => {
    const startIndex = (upcomingPage - 1) * PAGE_SIZE;
    return upcomingMatches.slice(startIndex, startIndex + PAGE_SIZE);
  }, [upcomingMatches, upcomingPage]);
  const paginatedCompletedMatches = useMemo(() => {
    const startIndex = (completedPage - 1) * PAGE_SIZE;
    return completedMatches.slice(startIndex, startIndex + PAGE_SIZE);
  }, [completedMatches, completedPage]);

  const handleSave = async (matchId, form) => {
    setMessage("");
    setError("");
    setSavingMatchId(matchId);

    try {
      const { data } = await api.put(`/predictions/${matchId}`, form);
      setPredictions((current) => {
        const next = current.filter((prediction) => String(prediction.matchId) !== String(matchId));
        return [data, ...next];
      });
      setMessage("Prediction saved successfully.");
      setSaveModal({
        open: true,
        isUpdate: Boolean(predictionMap.get(String(matchId))),
      });
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Could not save prediction."));
    } finally {
      setSavingMatchId("");
    }
  };

  return (
    <div className="stack-page">
      {saveModal.open ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSaveModal({ open: false, isUpdate: false })}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prediction-save-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Prediction Saved</p>
            <h3 id="prediction-save-title">
              {saveModal.isUpdate ? "Your prediction was updated successfully." : "Your prediction was submitted successfully."}
            </h3>
            <p className="muted">
              You can edit this prediction any time before the deadline. Once the deadline passes, the prediction will be locked.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setSaveModal({ open: false, isUpdate: false })}
            >
              Okay
            </button>
          </div>
        </div>
      ) : null}

      <section className="league-hero">
        <div className="league-hero-copy">
          <p className="eyebrow">IPL 2026</p>
          <h2>Prediction Arena</h2>
          <p className="muted">Predict like a genius, celebrate like a champion, and blame the toss when everything goes wrong.</p>
        </div>
        <div className="league-hero-badge">
          {!heroImageFailed ? (
            <img
              src="/branding/ipl-2026.png"
              alt="Indian Premier League"
              className="league-hero-image"
              onError={() => setHeroImageFailed(true)}
            />
          ) : (
            <div className="league-hero-fallback">IPL 2026</div>
          )}
        </div>
      </section>

      {teams.length ? <TeamTicker teams={teams} /> : null}

      {message ? <div className="success-banner">{message}</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}

      <section className="matches-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Next Page</p>
            <h3>Today & Upcoming Matches</h3>
          </div>
          <Pagination currentPage={upcomingPage} totalPages={upcomingTotalPages} onPageChange={setUpcomingPage} />
        </div>

        <div className="card-stack">
          {paginatedUpcomingMatches.length ? (
            paginatedUpcomingMatches.map((match) => (
              <PredictionCard
                key={match.id}
                match={match}
                teams={{
                  team1: teamMap.get(match.team1),
                  team2: teamMap.get(match.team2),
                }}
                existingPrediction={predictionMap.get(String(match.id))}
                onSave={handleSave}
                isSaving={savingMatchId === match.id}
              />
            ))
          ) : (
            <div className="state-card">No today or upcoming matches are available.</div>
          )}
        </div>
      </section>

      <section className="matches-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Previous Page</p>
            <h3>Completed Matches</h3>
          </div>
          <Pagination currentPage={completedPage} totalPages={completedTotalPages} onPageChange={setCompletedPage} />
        </div>

        <div className="card-stack">
          {paginatedCompletedMatches.length ? (
            paginatedCompletedMatches.map((match) => (
              <PredictionCard
                key={match.id}
                match={match}
                teams={{
                  team1: teamMap.get(match.team1),
                  team2: teamMap.get(match.team2),
                }}
                existingPrediction={predictionMap.get(String(match.id))}
                onSave={handleSave}
                isSaving={savingMatchId === match.id}
              />
            ))
          ) : (
            <div className="state-card">Completed matches will appear here after their dates pass.</div>
          )}
        </div>
      </section>
    </div>
  );
}
