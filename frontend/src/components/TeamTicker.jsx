import { useState } from "react";
import { getTeamPalette, TEAM_LOGO_PATHS } from "../utils/teams";

function TeamPill({ team }) {
  const palette = getTeamPalette(team.shortName);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="ticker-pill">
      {TEAM_LOGO_PATHS[team.shortName] && !logoFailed ? (
        <img
          className="ticker-logo-image"
          src={TEAM_LOGO_PATHS[team.shortName]}
          alt={`${team.name} logo`}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="ticker-logo" style={{ background: palette.bg, color: palette.fg }}>
          {team.shortName}
        </span>
      )}
      <span>{team.name}</span>
    </div>
  );
}

export default function TeamTicker({ teams }) {
  const items = [...teams, ...teams];

  return (
    <div className="ticker-shell" aria-label="IPL teams">
      <div className="ticker-track">
        {items.map((team, index) => (
          <TeamPill key={`${team.shortName}-${index}`} team={team} />
        ))}
      </div>
    </div>
  );
}
