import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="marketing-shell">
      <section className="hero-panel">
        <h1>Classic IPL prediction league</h1>
        <p className="hero-copy">
          Predict each match, follow the standings, and enjoy a simple league experience for the full IPL season.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="primary-button">
            Create Account
          </Link>
          <Link to="/signin" className="secondary-button">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
