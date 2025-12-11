<template>
  <section style="max-width:900px; margin:auto; padding:16px;">
    <h2>Minhas Fichas</h2>

    <div style="margin-bottom:12px;">
      <button class="btn" @click="novo">Criar nova ficha</button>
    </div>

    <div v-if="loading" class="small-muted">Carregando fichas...</div>
    <div v-else-if="error" style="color:tomato">{{ error }}</div>

    <ul v-else style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
      <li v-for="f in fichas" :key="f.id" class="ficha-card" 
          style="border:1px solid #ddd; padding:8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>{{ f.nome || "Sem nome" }}</strong>
          <div class="small-muted">
            {{ f.classe ? f.classe + " (Nível " + f.nivel + ")" : "Classe não definida" }}
            <span v-if="f.jogador"> - Jogador: {{ f.jogador }}</span>
          </div>
          <div v-if="f.pv_atual !== null && f.pv_max !== null" class="small-muted">
            PV: {{ f.pv_atual }}/{{ f.pv_max }}
          </div>
        </div>
        <div style="display:flex; gap:4px;">
          <button class="btn-secondary" @click="ver(f.id)">Ver</button>
          <button class="btn-secondary" @click="editar(f.id)">Editar</button>
          <button class="btn-danger" @click="deletar(f.id)">Deletar</button>
        </div>
      </li>

      <li v-if="!fichas.length" class="small-muted">Nenhuma ficha encontrada.</li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listFichas, deleteFicha } from "../api";

const router = useRouter();
const fichas = ref([]);
const loading = ref(false);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const data = await listFichas();
    const items = Array.isArray(data.results) ? data.results : data;
    fichas.value = items.map(d => ({
      id: d.id,
      nome: d.nome || "",
      classe: d.classe || "",
      nivel: d.nivel ?? 1,
      jogador: d.jogador || "",
      pv_atual: d.pv_atual,
      pv_max: d.pv_max,
    }));
  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar fichas.";
  } finally {
    loading.value = false;
  }
}

function ver(id) {
  if (!id) return (error.value = "ID inválido");
  router.push({ name: "fichas-detail", params: { id } });
}

function editar(id) {
  if (!id) return (error.value = "ID inválido");
  router.push({ name: "fichas-editar", params: { id } });
}

async function deletar(id) {
  if (!id) return (error.value = "ID inválido");
  if (!confirm("Tem certeza que deseja deletar esta ficha?")) return;
  try {
    await deleteFicha(id);
    fichas.value = fichas.value.filter(f => f.id !== id);
  } catch (err) {
    console.error(err);
    alert("Erro ao deletar ficha.");
  }
}

function novo() {
  router.push({ name: "fichas-nova" });
}

onMounted(load);
</script>

<style scoped>
</style>
