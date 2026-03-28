import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api, { setApiToken } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "ipl_prediction_token";
const USER_KEY = "ipl_prediction_user";

export function AuthProvider({ children }) {
  const skipBootstrapRef = useRef(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(token && !localStorage.getItem(USER_KEY)));

  useEffect(() => {
    setApiToken(token);
  }, [token]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

       if (user) {
        setIsBootstrapping(false);
      }

      if (skipBootstrapRef.current) {
        skipBootstrapRef.current = false;
        setIsBootstrapping(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken("");
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token, user]);

  const persistAuth = (payload) => {
    skipBootstrapRef.current = true;
    setToken(payload.token);
    setUser(payload.user);
    setIsBootstrapping(false);
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    setApiToken(payload.token);
  };

  const signup = async (values) => {
    const { data } = await api.post("/auth/signup", values);
    persistAuth(data);
    return data.user;
  };

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    persistAuth(data);
    return data.user;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    persistAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setApiToken("");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      signup,
      login,
      googleLogin,
      logout,
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
