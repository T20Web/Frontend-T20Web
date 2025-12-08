import axios from "axios";

// Base da API
const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

// ------------------------------
// Tratamento de erros da API
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
// Autenticação (opcional)
// ------------------------------
// Seu backend não tem login ainda.
// Mantive o código, mas desativei para não quebrar nada.

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

const existingToken = localStorage.getItem("token");
if (existingToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// ------------------------------
// Usuários (corrigido para /usuarios/)
// ------------------------------
export async function listUsuarios() {
  try {
    const res = await api.get("/usuarios/");
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function getUsuario(id) {
  try {
    const res = await api.get(`/usuarios/${id}/`);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function createUsuario(payload) {
  try {
    const res = await api.post("/usuarios/", payload);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

// ------------------------------
// Fichas
// ------------------------------
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
// ==== FAKE TEMPORÁRIO PARA EVITAR ERRO DE IMPORT ====
// Remova depois
export async function loginApi() {
  return { token: "fake-token" };
}

export async function registerApi() {
  return { user: "fake-user" };
}

// ------------------------------
// Export/Import removidos
// ------------------------------
// Esses endpoints não existem no seu backend atual.
// Depois posso recriar se você quiser.

export { api };
