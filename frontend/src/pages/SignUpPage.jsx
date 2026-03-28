import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/AuthContext";
import { getRequestErrorMessage } from "../utils/errors";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
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
        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          disabled={isSubmitting}
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          disabled={isSubmitting}
        />

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        {googleEnabled ? (
          <>
            <div className="divider">or</div>
            <GoogleSignInButton onCredential={handleGoogleLogin} disabled={isSubmitting} />
          </>
        ) : null}

        <p className="muted small-text">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
