// src/stores/authStore.js
import { defineStore } from "pinia";
import { loginApi, registerApi, getMe } from "@/services/authService";
import { setAuthToken } from "@/plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(payload) {
      const data = await loginApi(payload);

      // Ajustar para seu backend: refresh + access
      this.token = data.access;
      setAuthToken(data.access);

      this.user = {
        id: data.id,
        username: data.username,
        email: data.email,
      };

      return data;
    },

    async register(payload) {
      const data = await registerApi(payload);

      if (data.access) {
        this.token = data.access;
        setAuthToken(data.access);
      }

      return data;
    },

    async loadUser() {
      if (!this.token) return;
      this.user = await getMe();
    },

    logout() {
      this.user = null;
      this.token = null;
      setAuthToken(null);
    },
  },
});
