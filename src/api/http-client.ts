import axios from "axios";

const DEFAULT_API_URL = "http://localhost:18000";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = import.meta.env.DEV
  ? "/api"
  : configuredApiUrl || DEFAULT_API_URL;

export const http = axios.create({
  baseURL,
  timeout: 10000,
});

let authToken: string | null =
  typeof window !== "undefined"
    ? window.localStorage.getItem("locative_access_token")
    : null;

export function setHttpAuthToken(token: string | null) {
  authToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("locative_access_token", token);
    } else {
      window.localStorage.removeItem("locative_access_token");
    }
  }
}

http.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${authToken}`;
  }

  return config;
});
