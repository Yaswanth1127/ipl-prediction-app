import { useEffect, useState } from "react";
import { formatDateTime, getCountdownLabel } from "../utils/formatters";
import { getTeamPalette, TEAM_LOGO_PATHS } from "../utils/teams";

const defaultForm = {
  winner: "",
  playerOfMatch: "",
  mostRuns: "",
  mostWickets: "",
  mostFours: "",
  mostSixes: "",
};

const getUniquePlayers = (...groups) =>
  [...new Set(groups.flat().filter(Boolean))].sort((a, b) => a.localeCompare(b));

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
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setForm(existingPrediction?.prediction || defaultForm);
  }, [existingPrediction]);

  const isLocked = new Date(match.deadline) <= new Date();
  const team1Players = teams.team1?.players || {};
  const team2Players = teams.team2?.players || {};
  const groupedAllPlayers = [
    {
      label: teams.team1?.name || match.team1,
      options: getUniquePlayers(
        team1Players.batters || [],
        team1Players.wicketkeepers || [],
        team1Players.allRounders || [],
        team1Players.bowlers || []
      ),
    },
    {
      label: teams.team2?.name || match.team2,
      options: getUniquePlayers(
        team2Players.batters || [],
        team2Players.wicketkeepers || [],
        team2Players.allRounders || [],
        team2Players.bowlers || []
      ),
    },
  ].filter((group) => group.options.length);
  const groupedWicketOptions = [
    {
      label: teams.team1?.name || match.team1,
      options: getUniquePlayers(team1Players.bowlers || [], team1Players.allRounders || []),
    },
    {
      label: teams.team2?.name || match.team2,
      options: getUniquePlayers(team2Players.bowlers || [], team2Players.allRounders || []),
    },
  ].filter((group) => group.options.length);
  const teamOptions = [match.team1, match.team2];

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
        <SelectField
          label="Winner"
          value={form.winner}
          onChange={handleChange("winner")}
          options={teamOptions}
          disabled={isLocked || isSaving}
          compact
        />
        <SelectField label="Player of the Match" value={form.playerOfMatch} onChange={handleChange("playerOfMatch")} options={groupedAllPlayers} disabled={isLocked || isSaving} />
        <SelectField label="Most Runs" value={form.mostRuns} onChange={handleChange("mostRuns")} options={groupedAllPlayers} disabled={isLocked || isSaving} />
        <SelectField label="Most Fours" value={form.mostFours} onChange={handleChange("mostFours")} options={groupedAllPlayers} disabled={isLocked || isSaving} />
        <SelectField label="Most Wickets" value={form.mostWickets} onChange={handleChange("mostWickets")} options={groupedWicketOptions.length ? groupedWicketOptions : groupedAllPlayers} disabled={isLocked || isSaving} />
        <SelectField label="Most Sixes" value={form.mostSixes} onChange={handleChange("mostSixes")} options={groupedAllPlayers} disabled={isLocked || isSaving} />

        <div className="card-footer">
          <p className="muted small-text">
            Deadline: {formatDateTime(match.deadline)}
            <br />
            Points: Winner 50, Player of the Match 30, Runs/Wickets 20, Fours/Sixes 15.
          </p>
          <button type="submit" className="primary-button" disabled={isLocked || isSaving}>
            {isSaving ? "Saving..." : existingPrediction ? "Update Prediction" : "Save Prediction"}
          </button>
        </div>
      </form>
    </section>
  );
}
