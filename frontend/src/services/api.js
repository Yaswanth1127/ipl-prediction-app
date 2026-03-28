import axios from "axios";

const TOKEN_KEY = "ipl_prediction_token";
const USER_KEY = "ipl_prediction_user";
const LOCAL_API_BASE_URL = "http://localhost:5000/api";
const PROD_API_BASE_URL = "https://ipl-prediction-app-2.onrender.com/api";
const initialToken =
  typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) || "" : "";

const getApiBaseUrl = () => {
  const configuredBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  const configuredLocalBaseUrl = String(import.meta.env.VITE_LOCAL_API_BASE_URL || "").trim();

  if (typeof window !== "undefined") {
    const isLocalFrontend = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (isLocalFrontend) {
      return configuredLocalBaseUrl || LOCAL_API_BASE_URL;
    }
  }

  return configuredBaseUrl || PROD_API_BASE_URL;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: initialToken
    ? {
        Authorization: `Bearer ${initialToken}`,
      }
    : undefined,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) || "" : "";

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url || "");
    const hadAuthHeader = Boolean(error?.config?.headers?.Authorization);
    const isAuthSessionRequest = requestUrl.includes("/auth/me");

    if (typeof window !== "undefined" && (status === 401 || status === 403) && (hadAuthHeader || isAuthSessionRequest)) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      delete api.defaults.headers.common.Authorization;

      if (!window.location.pathname.startsWith("/signin")) {
        window.location.assign("/signin");
      }
    }

    return Promise.reject(error);
  }
);

export const setApiToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export default api;
