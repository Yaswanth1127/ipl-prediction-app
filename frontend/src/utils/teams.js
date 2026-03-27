export const TEAM_LOGO_PATHS = {
  GT: "/team-logos/gt.jpg",
  CSK: "/team-logos/csk.avif",
  DC: "/team-logos/dc.jpg",
  MI: "/team-logos/mi.jpg",
  PBKS: "/team-logos/pbks.jpg",
  RCB: "/team-logos/rcb.jpg",
  KKR: "/team-logos/kkr.jpg",
  SRH: "/team-logos/srh.jpg",
  LSG: "/team-logos/lsg.jpg",
  RR: "/team-logos/rr.jpg",
};

export const getTeamPalette = (shortName) => {
  const palettes = {
    RCB: { bg: "#b61f2b", fg: "#fff6dc" },
    SRH: { bg: "#ef7d1a", fg: "#fff8e9" },
    MI: { bg: "#1d4d8f", fg: "#eef5ff" },
    KKR: { bg: "#512d82", fg: "#f9ed8c" },
    RR: { bg: "#ea4c89", fg: "#fff4f8" },
    CSK: { bg: "#f2c500", fg: "#1c1c1c" },
    PBKS: { bg: "#d71920", fg: "#fff4f4" },
    GT: { bg: "#1c2c5b", fg: "#e6edff" },
    LSG: { bg: "#00a6d6", fg: "#f1feff" },
    DC: { bg: "#17479e", fg: "#f2f6ff" },
  };

  return palettes[shortName] || { bg: "#6a5a44", fg: "#fffaf1" };
};
