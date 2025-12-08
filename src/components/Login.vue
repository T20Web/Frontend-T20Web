<template>
  <main class="auth-page">
    <section class="auth-card" role="main" aria-labelledby="login-title">
      <div class="brand">
        <div class="logo">T20</div>
        <div class="brand-text">
          <h1 id="login-title">Entrar</h1>
          <p class="muted">Acesse sua conta e gerencie suas fichas.</p>
        </div>
      </div>

      <form class="form" @submit.prevent="submit" novalidate>
        <div v-if="error" class="alert" role="alert">{{ error }}</div>

        <label class="field">
          <span class="label-text">Email</span>
          <div class="input-wrap">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden>
              <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5z"
                fill="currentColor" />
            </svg>
            <input type="email" v-model.trim="email" required autocomplete="username" placeholder="seu@exemplo.com"
              :disabled="loading" aria-label="Email" />
          </div>
          <small v-if="email && !validEmail" class="hint error">Email inválido</small>
        </label>

        <label class="field">
          <span class="label-text">Senha</span>
          <div class="input-wrap">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 10v-2a6 6 0 1112 0v2" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" required
              autocomplete="current-password" placeholder="••••••••" :disabled="loading" aria-label="Senha" />
            <button type="button" class="btn-icon" @click="showPassword = !showPassword" :aria-pressed="showPassword"
              :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'">
              <svg v-if="!showPassword" class="eye" viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" fill="none"
                  stroke-width="1.4" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <svg v-else class="eye" viewBox="0 0 24 24">
                <path d="M2 2l20 20" stroke="currentColor" stroke-width="1.6" fill="none" />
                <path d="M3.6 4.6C6 3 9 2 12 2c7 0 11 7 11 7-1.1 2-2.9 3.9-5 5.4" stroke="currentColor"
                  stroke-width="1.2" fill="none" />
              </svg>
            </button>
          </div>
        </label>

        <div class="actions">
          <button class="btn primary" :disabled="!canSubmit || loading">
            <span v-if="!loading">Entrar</span>
            <span v-else class="spinner" aria-hidden></span>
          </button>

          <router-link class="link-muted" to="/register">Criar conta</router-link>
        </div>

        <div class="small-muted" style="margin-top:10px;">
          Esqueceu a senha? <a href="#" class="link-muted">Recuperar</a>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validEmail = computed(() => emailRegex.test(email.value));
const canSubmit = computed(() => validEmail.value && password.value.length >= 1);

async function submit() {
  error.value = "";
  if (!validEmail.value) {
    error.value = "Informe um email válido.";
    return;
  }
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    const next = route.query.next || "/fichas";
    router.push(next);
  } catch (err) {
    // err pode ser Error criado por normalizeAxiosError
    error.value = err.message || "Erro ao fazer login.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
:root {
  --card-bg: #ffffff;
  --muted: #7b7f86;
  --primary: #b7282c;
  --accent: #f6f6f8;
  --danger: #e05a5a;
  --shadow: 0 6px 24px rgba(18, 18, 20, 0.06);
}

.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72vh;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 520px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 22px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f8;
  color: var(--primary);
  font-weight: 700;
  font-size: 1.05rem;
}

.brand-text h1 {
  margin: 0;
  font-size: 1.3rem;
}

.muted {
  color: var(--muted);
  margin: 0;
  font-size: 0.95rem;
}

.form {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-text {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--muted);
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--accent);
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.input-wrap input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  padding: 6px 0;
  font-size: 1rem;
  color: var(--text);
}

.icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
  color: var(--muted);
}

.btn-icon {
  background: none;
  border: 0;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  border: 0;
}

.btn.primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 6px 18px rgba(183, 40, 44, 0.12);
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.link-muted {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
}

.small-muted {
  color: var(--muted);
  font-size: 0.9rem;
}

.alert {
  background: #fff2f2;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}

.hint.error {
  color: var(--danger);
  font-size: 0.85rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
  position: relative;
}

.spinner::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-top-color: transparent;
  animation: spin .9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
