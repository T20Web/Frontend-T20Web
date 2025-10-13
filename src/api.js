import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

function normalizeAxiosError(err) {
  if (err.response) {
    const e = new Error("API Error");
    e.status = err.response.status;
    e.body = err.response.data;
    throw e;
  }
  const e = new Error(err.message || "Network Error");
  throw e;
}

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
    if (res.status === 204) return {};
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function exportFicha(id) {
  try {
    const res = await api.get(`/fichas/${id}/export/`);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

export async function importFicha(obj) {
  try {
    const res = await api.post(`/fichas/import_json/`, obj);
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}