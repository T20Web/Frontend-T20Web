<!-- src/components/ThemeSwitch.vue -->
<template>
  <button
    :aria-pressed="isDark"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    @click="toggle"
    class="theme-switch"
    :title="isDark ? 'Modo escuro ativado' : 'Modo claro ativado'"
    role="switch"
  >
    <span class="icon" v-if="!isDark" aria-hidden="true" v-html="sunSvg"></span>
    <span class="icon" v-else aria-hidden="true" v-html="moonSvg"></span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getInitialTheme, applyTheme, saveTheme } from '../theme';

const isDark = ref(false);

const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></g></svg>`;
const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function toggle() {
  const next = isDark.value ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
  isDark.value = next === 'dark';
  // emite evento global (opcional)
  window.dispatchEvent(new CustomEvent('t20:theme-changed', { detail: { theme: next } }));
}

onMounted(() => {
  const initial = getInitialTheme();
  isDark.value = initial === 'dark';
  applyTheme(initial);
});
</script>

<style scoped>
.theme-switch {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:40px;
  height:40px;
  border-radius:10px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--text);
  cursor: pointer;
  transition: transform var(--transition-fast) ease, background var(--transition) ease, color var(--transition) ease;
}
.theme-switch:hover { transform: translateY(-3px); }
.theme-switch:active { transform: translateY(-1px); }

/* ícone */
.icon { display:inline-flex; }
.theme-switch svg { width:18px; height:18px; }
</style>
