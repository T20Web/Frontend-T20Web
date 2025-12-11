// src/services/authService.js
import api, { normalizeAxiosError } from "@/plugins/axios";

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
