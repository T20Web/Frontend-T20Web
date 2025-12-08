<template>
  <div class="site-wrapper">
    <Navbar />
    <main class="site-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "./router";
import { logout } from "./api";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const token = ref(localStorage.getItem("token"));

function doLogout() {
  logout();
  token.value = null;
  router.push({ name: "login" });
}
</script>

<style>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.site-main {
  flex: 1;
  max-width: var(--max-width);
  margin: 32px auto;
  padding: 0 16px;
}
</style>
