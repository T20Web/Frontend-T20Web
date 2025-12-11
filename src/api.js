// =========================================================
// api.js — PLUGIN AXIOS
// =========================================================

import axios from "axios";

// Base da API
const BASE = "https://backend-t20web-lnil.onrender.com/";

const api = axios.create({
  baseURL: BASE,
  timeout: 100000,
});

// ------------------------------
// Tratamento global de erros
// ------------------------------
function normalizeAxiosError(err) {
  if (err.response) {
    const e = new Error(err.response.data?.detail || "Erro na API");
    e.status = err.response.status;
    e.body = err.response.data;
    throw e;
  }
  throw new Error(err.message || "Erro de conexão");
}

// ------------------------------
// AUTH TOKEN (Plugin)
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

export function logout() {
  setAuthToken(null);
}

// Recupera token salvo
const existingToken = localStorage.getItem("token");
if (existingToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// =========================================================
// SERVICES — Auth
// =========================================================

export async function loginApi(payload) {
  try {
    const res = await api.post("/auth/login/", payload);
    return res.data; 
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function registerApi(payload) {
  try {
    const res = await api.post("/auth/register/", payload);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function getMe() {
  try {
    const res = await api.get("/auth/me/");
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

// =========================================================
// SERVICES — Fichas CRUD
// =========================================================

export async function listFichas() {
  try {
    const res = await api.get("/fichas/");
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function getFicha(id) {
  try {
    const res = await api.get(`/fichas/${id}/`);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function createFicha(payload) {
  try {
    const res = await api.post("/fichas/", payload);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function updateFicha(id, payload) {
  try {
    const res = await api.patch(`/fichas/${id}/`, payload);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function deleteFicha(id) {
  try {
    const res = await api.delete(`/fichas/${id}/`);
    return res.status === 204 ? {} : res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

// =========================================================
// EXPORT PRINCIPAL
// =========================================================

export { api };
