<template>
  <div id="app">
    <header style="padding:16px; border-bottom:1px solid #eee;">
      <h1>T20Web — Fichas (Frontend base)</h1>
    </header>

    <main style="padding:16px;">
      <Home />
    </main>

    <footer style="padding:16px; border-top:1px solid #eee; margin-top:32px;">
      <small>Frontend mínimo - conecte ao backend Django</small>
    </footer>
  </div>
</template>

<script setup>
import Home from "./components/Home.vue";
</script>
