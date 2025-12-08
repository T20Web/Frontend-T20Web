<!-- src/components/Navbar.vue -->
<template>
  <header class="site-header" role="banner" style="padding:14px 16px; background:var(--header-bg); border-bottom:1px solid var(--border);">
    <nav style="display:flex; align-items:center; justify-content:space-between; max-width:var(--max-width); margin:0 auto;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg, rgba(183,40,44,0.12), transparent); border:1px solid var(--border);">
          <strong style="color:var(--primary)">T20</strong>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:700;">T20Web</span>
          <small class="small-muted">Fichas</small>
        </div>
      </div>

      <div style="display:flex; gap:12px; align-items:center;">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/fichas" class="nav-link">Fichas</router-link>

        <!-- Mostrar Login / Registrar se não estiver autenticado -->
        <template v-if="!auth.isAuthenticated">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Registrar</router-link>
        </template>

        <!-- Mostrar botão Sair se estiver autenticado -->
        <button v-else @click="auth.logout" class="nav-link" style="cursor:pointer; background:none; border:none; padding:6px; font-weight:600;">Sair</button>

        <!-- Theme toggle -->
        <ThemeSwitch />
      </div>
    </nav>
  </header>
</template>

<script setup>
import ThemeSwitch from './ThemeSwitch.vue';
import { useAuth } from "../composables/useAuth";

const auth = useAuth();
</script>

<style scoped>
.nav-link { color:var(--muted); text-decoration:none; font-weight:600; padding:6px; border-radius:8px; }
.nav-link:hover { color:var(--text); background:rgba(0,0,0,0.03); transform:translateY(-2px); transition: .12s ease; }
button.nav-link:hover { background:rgba(0,0,0,0.03); transform:translateY(-2px); }
</style>
