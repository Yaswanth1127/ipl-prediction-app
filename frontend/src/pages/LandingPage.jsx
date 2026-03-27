import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="marketing-shell">
      <section className="hero-panel">
        <p className="eyebrow">Classic IPL prediction league</p>
        <h1>Run your friends-only prediction contest with clean admin control.</h1>
        <p className="hero-copy">
          Let users sign in, submit or edit predictions before the deadline, and keep the leaderboard updated as soon
          as match results are posted.
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
