<!-- src/components/Register.vue -->
<template>
  <main class="auth-page">
    <section class="auth-card" role="main" aria-labelledby="register-title">
      <div class="brand">
        <div class="logo">T20</div>
        <div class="brand-text">
          <h1 id="register-title">Criar conta</h1>
          <p class="muted">Registre-se para salvar e acessar suas fichas em qualquer lugar.</p>
        </div>
      </div>

      <form class="form" @submit.prevent="submit" novalidate>
        <div v-if="error" class="alert" role="alert">{{ error }}</div>

        <label class="field">
          <span class="label-text">Nome</span>
          <div class="input-wrap">
            <input v-model.trim="name" required placeholder="Seu nome" :disabled="loading" />
          </div>
          <small v-if="name && name.length < 2" class="hint error">Nome muito curto</small>
        </label>

        <label class="field">
          <span class="label-text">Email</span>
          <div class="input-wrap">
            <input type="email" v-model.trim="email" required placeholder="seu@exemplo.com" :disabled="loading" />
          </div>
          <small v-if="email && !validEmail" class="hint error">Email inválido</small>
        </label>

        <label class="field">
          <span class="label-text">Senha</span>
          <div class="input-wrap">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Mínimo 8 caracteres" :disabled="loading" />
            <button type="button" class="btn-icon" @click="showPassword = !showPassword" :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'">
              <svg v-if="!showPassword" class="eye" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" fill="none" stroke-width="1.4"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
              <svg v-else class="eye" viewBox="0 0 24 24"><path d="M2 2l20 20" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M3.6 4.6C6 3 9 2 12 2c7 0 11 7 11 7-1.1 2-2.9 3.9-5 5.4" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
            </button>
          </div>
          <small v-if="password && password.length < 8" class="hint error">Senha precisa ter ao menos 8 caracteres</small>
        </label>

        <label class="field">
          <span class="label-text">Confirmar senha</span>
          <div class="input-wrap">
            <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" required placeholder="Repita a senha" :disabled="loading" />
          </div>
          <small v-if="confirmPassword && confirmPassword !== password" class="hint error">As senhas não coincidem</small>
        </label>

        <div class="actions">
          <button class="btn primary" :disabled="!canSubmit || loading">
            <span v-if="!loading">Criar conta</span>
            <span v-else class="spinner" aria-hidden></span>
          </button>

          <router-link class="link-muted" to="/login">Já tenho conta</router-link>
        </div>

      </form>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const auth = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validEmail = computed(() => emailRegex.test(email.value));
const canSubmit = computed(() => name.value.trim().length >= 2 && validEmail.value && password.value.length >= 8 && password.value === confirmPassword.value);

async function submit() {
  error.value = "";
  if (!canSubmit.value) {
    error.value = "Corrija os erros do formulário antes de enviar.";
    return;
  }
  loading.value = true;
  try {
    await auth.register(name.value, email.value, password.value);
    router.push("/fichas");
  } catch (err) {
    error.value = err.message || "Erro ao registrar.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Reuse same tokens as Login.vue (kept local for component isolation) */
:root{
  --card-bg: #ffffff;
  --muted: #7b7f86;
  --primary: #b7282c;
  --accent: #f6f6f8;
  --danger: #e05a5a;
  --shadow: 0 6px 24px rgba(18,18,20,0.06);
}

.auth-page { display:flex; align-items:center; justify-content:center; min-height:72vh; padding:24px; }
.auth-card { width:100%; max-width:520px; background:var(--card-bg); border-radius:12px; padding:22px; box-shadow:var(--shadow); border:1px solid rgba(0,0,0,0.04); }
.brand { display:flex; gap:12px; align-items:center; margin-bottom:12px; }
.logo { width:56px; height:56px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg, rgba(183,40,44,0.12), transparent); color:var(--primary); font-weight:700; font-size:1.05rem; }
.brand-text h1 { margin:0; font-size:1.3rem; }
.muted { color:var(--muted); margin:0; font-size:0.95rem; }

.form { margin-top:12px; display:flex; flex-direction:column; gap:12px; }
.field { display:flex; flex-direction:column; gap:6px; }
.label-text { font-weight:600; font-size:0.85rem; color:var(--muted); }

.input-wrap { display:flex; align-items:center; gap:8px; border-radius:8px; background:var(--accent); padding:8px 10px; border:1px solid rgba(0,0,0,0.04); }
.input-wrap input { flex:1; border:0; background:transparent; outline:none; padding:6px 0; font-size:1rem; color:var(--text); }
.btn-icon { background:none; border:0; padding:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.btn { padding:10px 14px; border-radius:10px; font-weight:700; cursor:pointer; border:0; }
.btn.primary { background:var(--primary); color:white; box-shadow: 0 6px 18px rgba(183,40,44,0.12); }
.btn[disabled] { opacity:0.6; cursor:not-allowed; transform:none; }
.actions { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:6px; }
.link-muted { color:var(--muted); text-decoration:none; font-weight:600; }
.small-muted { color:var(--muted); font-size:0.9rem; }

.alert { background:#fff2f2; border:1px solid var(--danger); color:var(--danger); padding:10px; border-radius:8px; font-weight:600; }

.hint.error { color:var(--danger); font-size:0.85rem; }

.spinner { width:16px; height:16px; border-radius:50%; display:inline-block; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.18); position:relative; }
.spinner::after { content:""; position:absolute; inset:0; border-radius:50%; border:2px solid rgba(255,255,255,0.6); border-top-color: transparent; animation:spin .9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
