import { useEffect, useState } from "react";
import { formatDateTime, getCountdownLabel } from "../utils/formatters";
import { getTeamPalette, TEAM_LOGO_PATHS } from "../utils/teams";
import {
  defaultPredictionForm,
  getPredictionFieldOptions,
  predictionFieldLabels,
  predictionFieldOrder,
} from "../utils/predictionFields";

const TeamBadge = ({ shortName, name }) => {
  const palette = getTeamPalette(shortName);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="team-badge">
      {TEAM_LOGO_PATHS[shortName] && !logoFailed ? (
        <img
          className="team-logo-image"
          src={TEAM_LOGO_PATHS[shortName]}
          alt={`${name} logo`}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="team-logo" style={{ background: palette.bg, color: palette.fg }}>
          {shortName}
        </span>
      )}
      <div>
        <strong>{shortName}</strong>
        <p className="muted small-text">{name}</p>
      </div>
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, disabled, compact = false }) => (
  <label className={compact ? "field-compact" : undefined}>
    {label}
    <select value={value} onChange={onChange} disabled={disabled}>
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

export default function PredictionCard({ match, teams, existingPrediction, onSave, isSaving }) {
  const [form, setForm] = useState(defaultPredictionForm);

  useEffect(() => {
    setForm({
      ...defaultPredictionForm,
      ...(existingPrediction?.prediction || {}),
    });
  }, [existingPrediction]);

  const tossLocked = new Date(match.startTime) <= new Date();
  const isLocked = new Date(match.deadline) <= new Date();
  const hasSavedTossWinner = Boolean(existingPrediction?.prediction?.tossWinner);
  const canSubmit = !isLocked && (!tossLocked || hasSavedTossWinner);
  const predictionOptions = getPredictionFieldOptions(match, teams);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(match.id, form);
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Match {match.matchNo}</p>
          <h3>
            {match.team1} vs {match.team2}
          </h3>
          <p className="muted">
            {match.venue} • {formatDateTime(match.startTime)}
          </p>
        </div>
        <div className={isLocked ? "status-pill locked" : "status-pill open"}>{getCountdownLabel(match.deadline)}</div>
      </div>

      <div className="teams-row">
        <TeamBadge shortName={match.team1} name={teams.team1?.name || match.team1} />
        <span className="versus-mark">vs</span>
        <TeamBadge shortName={match.team2} name={teams.team2?.name || match.team2} />
      </div>

      <form className="prediction-grid compact-prediction-grid" onSubmit={handleSubmit}>
        {predictionFieldOrder.map((field) => (
          <SelectField
            key={field}
            label={predictionFieldLabels[field]}
            value={form[field]}
            onChange={handleChange(field)}
            options={predictionOptions[field]}
            disabled={isSaving || isLocked || (field === "tossWinner" && tossLocked)}
            compact
          />
        ))}

        <div className="card-footer">
          <p className="muted small-text">
            Toss lock: {formatDateTime(match.startTime)}
            <br />
            Final deadline: {formatDateTime(match.deadline)}
            <br />
            Toss Winner locks at toss time. All other fields stay editable until 3:30 PM or 7:30 PM IST.
            <br />
            Points: Winner 50, Toss 50, Player of the Match 30, Runs/Wickets 20, Fours/Sixes 15.
          </p>
          <button type="submit" className="primary-button" disabled={!canSubmit || isSaving}>
            {isSaving ? "Saving..." : existingPrediction ? "Update Prediction" : "Save Prediction"}
          </button>
        </div>
      </form>

      {tossLocked && !hasSavedTossWinner ? (
        <p className="muted small-text">
          Toss Winner is already locked for this match, so new submissions are closed. Saved predictions can still update the remaining fields until the final deadline.
        </p>
      ) : null}
    </section>
  );
}
