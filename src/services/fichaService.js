// src/services/fichaService.js
import api, { normalizeAxiosError } from "@/plugins/axios";

export async function listFichas() {
  try { return (await api.get("/fichas/")).data; }
  catch (err) { normalizeAxiosError(err); }
}

export async function getFicha(id) {
  try { return (await api.get(`/fichas/${id}/`)).data; }
  catch (err) { normalizeAxiosError(err); }
}

export async function createFicha(payload) {
  try { return (await api.post("/fichas/", payload)).data; }
  catch (err) { normalizeAxiosError(err); }
}

export async function updateFicha(id, payload) {
  try { return (await api.patch(`/fichas/${id}/`, payload)).data; }
  catch (err) { normalizeAxiosError(err); }
}

export async function deleteFicha(id) {
  try {
    const res = await api.delete(`/fichas/${id}/`);
    return res.status === 204 ? {} : res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}
