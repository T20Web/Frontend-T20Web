<!-- src/components/Login.vue -->
<template>
  <section style="max-width:480px;">
    <h2>Login</h2>

    <form @submit.prevent="submit">
      <div style="margin-bottom:8px;">
        <label for="username">Usuário / Email</label><br/>
        <input id="username" v-model="username" required aria-label="Usuário" />
      </div>

      <div style="margin-bottom:8px;">
        <label for="password">Senha</label><br/>
        <input id="password" type="password" v-model="password" required aria-label="Senha" />
      </div>

      <div style="margin-top:12px;">
        <button type="submit" aria-label="Entrar">Entrar</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { loginApi, setAuthToken } from "../api";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");

async function submit() {
  try {
    // Chamada ao backend
    const data = await loginApi({ username: username.value, password: password.value });
    // Espera-se que data contenha { token: '...' } ou similar
    const token = data.token || data.access || data.key;
    if (!token) throw new Error("Resposta sem token.");

    // Salva token e seta header
    setAuthToken(token);

    // Redireciona para onde tentou ir ou para /fichas
    const next = route.query.next || "/fichas";
    router.push(next);
  } catch (err) {
    console.error(err);
    alert("Erro ao fazer login: " + (err.response?.data?.detail || err.message));
  }
}

/* Mock de teste local:
   Se API estiver offline, para testar, comente loginApi e faça:
   const data = { token: "mock-token" }; setAuthToken(data.token); router.push('/fichas');
*/
</script>
