import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const userNav = [
  { label: "Predictions", to: "/app/predictions" },
  { label: "My Predictions", to: "/app/my-predictions" },
  { label: "Leaderboard", to: "/app/leaderboard" },
];

const adminNav = [
  { label: "Admin Dashboard", to: "/admin" },
  { label: "Admin Leaderboard", to: "/admin/leaderboard" },
  { label: "User Portal", to: "/app/predictions" },
];

export default function AppLayout({ portal }) {
  const { user, logout } = useAuth();
  const links =
    portal === "admin"
      ? adminNav
      : user?.role === "admin"
        ? [...userNav, { label: "Admin Portal", to: "/admin" }]
        : userNav;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-brand">
          <p className="eyebrow">IPL Prediction League</p>
          <strong>{portal === "admin" ? "Admin Portal" : "Friends League"}</strong>
        </div>

        <nav className="top-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="content-topbar">
          <div className="topbar-user compact-user">
            <div>
              <p className="eyebrow">Signed in as</p>
              <strong>{user?.name}</strong>
            </div>
          </div>

          <div className="menu-wrap">
            <button
              type="button"
              className="menu-button"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>

            {menuOpen ? (
              <div className="menu-dropdown">
                <p className="profile-name">{user?.name}</p>
                <p className="muted small-text">{user?.email}</p>
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
