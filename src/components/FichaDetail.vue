<!-- src/components/FichaDetail.vue -->
<template>
  <section>
    <h2>Ficha: {{ ficha?.title || "..." }}</h2>

    <div v-if="loading">Carregando...</div>
    <div v-else-if="error" style="color:tomato">{{ error }}</div>
    <div v-else-if="ficha">
      <p><strong>Descrição:</strong> {{ ficha.description }}</p>
      <p><strong>Atributos:</strong></p>
      <pre>{{ typeof ficha.attributes === "object" ? JSON.stringify(ficha.attributes, null, 2) : ficha.attributes }}</pre>

      <div style="margin-top:12px;">
        <button @click="editar">Editar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getFicha } from "../api";

const route = useRoute();
const router = useRouter();

const ficha = ref(null);
const loading = ref(false);
const error = ref("");

async function load() {
  const id = route.params.id;
  loading.value = true;
  error.value = "";
  try {
    ficha.value = await getFicha(id);
  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar ficha.";
  } finally {
    loading.value = false;
  }
}

function editar() {
  router.push({ name: "fichas-editar", params: { id: route.params.id } });
}

onMounted(load);
</script>
