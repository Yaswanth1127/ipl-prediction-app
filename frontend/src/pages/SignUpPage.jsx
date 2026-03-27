import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";
import { getRequestErrorMessage } from "../utils/errors";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await signup(form);
      navigate(user.role === "admin" ? "/admin" : "/app/predictions", { replace: true });
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Unable to create account."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    setError("");

    try {
      const user = await googleLogin(credential);
      navigate(user.role === "admin" ? "/admin" : "/app/predictions", { replace: true });
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, "Google sign-in failed."));
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create account</p>
        <h1>Join the prediction league</h1>
        <p className="muted">Use email and password or continue with Google. Admin accounts are seeded separately.</p>
        {error ? <div className="error-banner">{error}</div> : null}

        <label>
          Full Name
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </label>

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        <div className="divider">or</div>
        <GoogleSignInButton onCredential={handleGoogleLogin} disabled={isSubmitting} />

        <p className="muted small-text">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
