import axios from "axios";

const TOKEN_KEY = "ipl_prediction_token";
const initialToken =
  typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) || "" : "";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
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

export const setApiToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export default api;
