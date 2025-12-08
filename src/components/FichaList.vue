<template>
  <section>
    <h2>Fichas</h2>

    <div style="margin-bottom:12px;">
      <button @click="novo">Criar ficha</button>
    </div>

    <div v-if="loading">Carregando fichas...</div>
    <div v-else-if="error" style="color:tomato">{{ error }}</div>
    <ul v-else>
      <li v-for="f in fichas" :key="f.id" style="margin-bottom:8px;">
        <strong>{{ f.title }}</strong> — <small>{{ f.description }}</small>
        <div style="margin-top:4px;">
          <button @click="ver(f.id)">Ver</button>
          <button @click="editar(f.id)">Editar</button>
        </div>
      </li>
    </ul>

    <div v-if="!fichas.length && !loading">Nenhuma ficha encontrada.</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listFichas } from "../api";

const router = useRouter();
const fichas = ref([]);
const loading = ref(false);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const data = await listFichas();

    // 🔥 Correção segura: garante que sempre seja um array
    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    // Mantém sua lógica de normalização de IDs
    fichas.value = arr.map(d => ({
      ...d,
      id: d.id ?? d.pk ?? d.id_ficha ?? null
    }));
  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar fichas.";
  } finally {
    loading.value = false;
  }
}

function ver(id) {
  router.push({ name: "fichaDetail", params: { id } });
}

function editar(id) {
  // 🔥 Rota corrigida para não causar erro
  router.push({ name: "fichaForm", params: { id } });
}

function novo() {
  // 🔥 Rota corrigida conforme seu router atual
  router.push({ name: "fichaForm" });
}

onMounted(load);
</script>
