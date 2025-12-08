<!-- src/components/Register.vue -->
<template>
  <section style="max-width:480px;">
    <h2>Registrar</h2>

    <form @submit.prevent="submit">
      <div style="margin-bottom:8px;">
        <label for="name">Nome</label><br/>
        <input id="name" v-model="name" required />
      </div>

      <div style="margin-bottom:8px;">
        <label for="email">Email</label><br/>
        <input id="email" type="email" v-model="email" required />
      </div>

      <div style="margin-bottom:8px;">
        <label for="password">Senha</label><br/>
        <input id="password" type="password" v-model="password" required />
      </div>

      <div style="margin-top:12px;">
        <button type="submit">Criar conta</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerApi } from "../api";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

async function submit() {
  try {
    await registerApi({ name: name.value, email: email.value, password: password.value });
    alert("Conta criada com sucesso. Faça login.");
    router.push({ name: "login" });
  } catch (err) {
    console.error(err);
    alert("Erro ao registrar: " + (err.response?.data || err.message));
  }
}

/* Mock:
   Para testar sem backend, chame router.push('/login') diretamente.
*/
</script>
