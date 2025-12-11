// src/plugins/axios.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 100000,
});

// ------------------------------
// Tratamento normalizado de erros
// ------------------------------
export function normalizeAxiosError(err) {
  if (err.response) {
    const e = new Error(err.response.data?.detail || "Erro na API");
    e.status = err.response.status;
    e.body = err.response.data;
    throw e;
  }
  throw new Error(err.message || "Erro de conexão");
}

// ------------------------------
// Token (setar / limpar)
// ------------------------------
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

// Auto carregar token se existir
const existingToken = localStorage.getItem("token");
if (existingToken) {
  setAuthToken(existingToken);
}

export default api;
