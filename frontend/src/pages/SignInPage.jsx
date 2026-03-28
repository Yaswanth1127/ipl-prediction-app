import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getRequestErrorMessage } from "../utils/errors";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const nextPath = location.state?.from?.pathname;

  useEffect(() => {
    let active = true;

    const warmUpBackend = async () => {
      try {
        await api.get("/health");
      } catch {
        // The real sign-in request will still surface any actual error.
      } finally {
        if (active) {
          setIsWarmingUp(false);
        }
      }
    };

    warmUpBackend();

    return () => {
      active = false;
    };
  }, []);

  const routeAfterLogin = (role) => {
    navigate(nextPath || (role === "admin" ? "/admin" : "/app/predictions"), { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(form);
      routeAfterLogin(user.role);
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Unable to sign in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    setError("");

    try {
      const user = await googleLogin(credential);
      routeAfterLogin(user.role);
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Google sign-in failed."));
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="signin-hero">
          <p className="eyebrow">IPL Season Access</p>
          <h1>Welcome To IPL 2026</h1>
          <p className="signin-tagline">Enter the league, lock your picks, and chase the top of the table.</p>
        </div>
        {error ? <div className="error-banner">{error}</div> : null}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          disabled={isSubmitting}
        />

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        {isWarmingUp ? <p className="muted small-text">Waking up the server for a faster sign-in...</p> : null}

        {googleEnabled ? (
          <>
            <div className="divider">or</div>
            <GoogleSignInButton onCredential={handleGoogleLogin} disabled={isSubmitting} />
          </>
        ) : null}

        <p className="muted small-text">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
