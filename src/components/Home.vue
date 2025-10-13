<!-- src/components/Home.vue -->
<template>
  <div>
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:16px;">
      <button class="btn" @click="openCreate">Nova Ficha</button>
      <input type="file" @change="onFile" accept=".json" />
      <span v-if="loading" class="small-muted">Carregando...</span>
      <span v-if="error" style="color:crimson">{{ error }}</span>
    </div>

    <FichaList
      :fichas="fichas"
      @reload="fetchFichas"
      @edit="openEdit"
      @export="baixar"
      @delete="remover"
      @view="verDetalhe"
    />

    <FichaForm
      v-if="showForm"
      :initial="editingFicha"
      @close="closeForm"
      @saved="onSaved"
    />

    <FichaDetail
      v-if="showDetail && selectedFicha"
      :ficha="selectedFicha"
      @close="closeDetail"
    >
      <template #actions>
        <button @click="openEdit(selectedFicha)">Editar</button>
        <button @click="baixar(selectedFicha.id)">Export</button>
      </template>
    </FichaDetail>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FichaList from "./FichaList.vue";
import FichaForm from "./FichaForm.vue";
import FichaDetail from "./FichaDetail.vue";
import { listFichas, getFicha, exportFicha, importFicha, deleteFicha } from "../api";

const fichas = ref([]);
const loading = ref(false);
const error = ref(null);
const showForm = ref(false);
const editingFicha = ref(null);

const showDetail = ref(false);
const selectedFicha = ref(null);

async function fetchFichas() {
  loading.value = true;
  error.value = null;
  try {
    const data = await listFichas();
    // se o backend usa paginação, retirar .results aqui
    fichas.value = Array.isArray(data) ? data : (data.results ?? []);
  } catch (e) {
    error.value = e.body?.detail || e.message || "Erro";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchFichas);

function openCreate() {
  editingFicha.value = null;
  showForm.value = true;
}

function openEdit(f) {
  // aceita tanto objeto ficha quanto id
  editingFicha.value = (typeof f === "object" ? f : fichas.value.find(x => x.id === f)) || null;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

async function onSaved() {
  showForm.value = false;
  await fetchFichas();
}

// detalhar ficha (buscando do backend)
async function verDetalhe(idOrObj) {
  try {
    const id = typeof idOrObj === "object" ? idOrObj.id : idOrObj;
    selectedFicha.value = await getFicha(id);
    showDetail.value = true;
  } catch (e) {
    alert("Erro ao carregar detalhe: " + (e.body?.detail || e.message));
  }
}

function closeDetail() {
  showDetail.value = false;
  selectedFicha.value = null;
}

async function baixar(id) {
  try {
    const json = await exportFicha(id);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ficha-${id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Erro ao exportar: " + (e.body?.detail || e.message));
  }
}

async function remover(id) {
  if (!confirm("Apagar esta ficha?")) return;
  try {
    await deleteFicha(id);
    await fetchFichas();
  } catch (e) {
    alert("Erro ao apagar: " + (e.body?.detail || e.message));
  }
}

async function onFile(e) {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const text = await f.text();
    const obj = JSON.parse(text);
    await importFicha(obj);
    alert("Importado com sucesso.");
    await fetchFichas();
  } catch (err) {
    alert("Erro ao importar: " + (err.body?.detail || err.message || err));
  } finally {
    e.target.value = "";
  }
}
</script>

<style scoped>
.small-muted { color: #6b7280; }
</style>
