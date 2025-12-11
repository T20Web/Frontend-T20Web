<template>
  <section style="max-width:800px; margin:auto;">
    <h2>{{ editMode ? "Editar Ficha" : "Criar Ficha" }}</h2>

    <form @submit.prevent="submit">
      <div v-if="error" style="color:tomato">{{ error }}</div>
      <div v-if="success" style="color:green">{{ success }}</div>

      <!-- Dados básicos -->
      <div style="margin-bottom:8px;">
        <label>Nome *</label>
        <input v-model="form.nome" required />
      </div>
      <div style="margin-bottom:8px;">
        <label>Raça</label>
        <input v-model="form.raca" />
      </div>
      <div style="margin-bottom:8px;">
        <label>Classe</label>
        <input v-model="form.classe" />
      </div>
      <div style="margin-bottom:8px;">
        <label>Tendência</label>
        <input v-model="form.tendencia" />
      </div>
      <div style="margin-bottom:8px;">
        <label>Jogador</label>
        <input v-model="form.jogador" />
      </div>

      <!-- Atributos -->
      <fieldset style="margin-bottom:8px;">
        <legend>Atributos (obrigatórios)</legend>
        <div v-for="k in attrKeys" :key="k" style="margin-bottom:4px;">
          <label>{{ kDisplay(k) }}</label>
          <input type="number" min="0" v-model.number="form.atributos[k]" />
        </div>
      </fieldset>

      <!-- Campos flexíveis -->
      <fieldset style="margin-bottom:8px;">
        <legend>Perícias</legend>
        <div v-for="(p,i) in form.pericias" :key="'p'+i" style="margin-bottom:2px;">
          <input v-model="form.pericias[i]" placeholder="Ex: Atletismo +3" />
          <button type="button" @click="removeFromList('pericias', i)">Rem</button>
        </div>
        <button type="button" @click="addToList('pericias')">+ Adicionar perícia</button>
      </fieldset>

      <fieldset style="margin-bottom:8px;">
        <legend>Poderes</legend>
        <div v-for="(p,i) in form.poderes" :key="'pow'+i" style="margin-bottom:2px;">
          <input v-model="form.poderes[i]" placeholder="Nome / descrição" />
          <button type="button" @click="removeFromList('poderes', i)">Rem</button>
        </div>
        <button type="button" @click="addToList('poderes')">+ Adicionar poder</button>
      </fieldset>

      <fieldset style="margin-bottom:8px;">
        <legend>Magias</legend>
        <div v-for="(m,i) in form.magias" :key="'m'+i" style="margin-bottom:2px;">
          <input v-model="form.magias[i]" placeholder="Nome / nível" />
          <button type="button" @click="removeFromList('magias', i)">Rem</button>
        </div>
        <button type="button" @click="addToList('magias')">+ Adicionar magia</button>
      </fieldset>

      <fieldset style="margin-bottom:8px;">
        <legend>Equipamentos</legend>
        <div v-for="(e,i) in form.equipamentos" :key="'e'+i" style="margin-bottom:2px;">
          <input v-model="form.equipamentos[i]" placeholder="Ex: Espada longa" />
          <button type="button" @click="removeFromList('equipamentos', i)">Rem</button>
        </div>
        <button type="button" @click="addToList('equipamentos')">+ Adicionar equipamento</button>
      </fieldset>

      <!-- PV / Defesa / Deslocamento -->
      <div style="margin-bottom:8px;">
        <label>PV Atual</label>
        <input type="number" v-model.number="form.pv_atual" />
      </div>
      <div style="margin-bottom:8px;">
        <label>PV Máx</label>
        <input type="number" v-model.number="form.pv_max" />
      </div>
      <div style="margin-bottom:8px;">
        <label>Defesa</label>
        <input v-model="form.defesa" />
      </div>
      <div style="margin-bottom:8px;">
        <label>Deslocamento</label>
        <input v-model="form.deslocamento" />
      </div>

      <!-- Resistências -->
      <fieldset style="margin-bottom:8px;">
        <legend>Resistências</legend>
        <div v-for="(r,i) in resistenciasList" :key="'r'+i" style="display:flex; gap:4px; margin-bottom:2px;">
          <input v-model="resistenciasList[i].key" placeholder="Tipo" />
          <input v-model="resistenciasList[i].value" placeholder="Valor / nota" />
          <button type="button" @click="removeResistencia(i)">Rem</button>
        </div>
        <button type="button" @click="addResistencia()">+ Adicionar resistência</button>
      </fieldset>

      <!-- Anotações -->
      <div style="margin-bottom:8px;">
        <label>Anotações</label>
        <textarea v-model="form.anotacoes" rows="4"></textarea>
      </div>

      <button type="submit">{{ editMode ? "Atualizar ficha" : "Criar ficha" }}</button>
      <button type="button" @click="cancelar">Cancelar</button>
    </form>

    <pre>{{ previewJson }}</pre>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createFicha, updateFicha, getFicha } from "../api";

const props = defineProps({
  id: { type: String, default: null },
  editMode: { type: Boolean, default: false }
});

const router = useRouter();

const attrKeys = ["for", "des", "con", "int", "sab", "car"];
const defaultAttributes = { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 };

const form = reactive({
  nome: "",
  raca: "",
  classe: "",
  nivel: 5,
  tendencia: "",
  jogador: "",
  atributos: { ...defaultAttributes },
  pericias: [],
  poderes: [],
  magias: [],
  equipamentos: [],
  anotacoes: "",
  pv_atual: null,
  pv_max: null,
  defesa: "",
  deslocamento: "",
  resistencias: {},
  schema_version: 1,
});

const resistenciasList = ref([]);
const error = ref("");
const success = ref("");

const previewJson = computed(() => {
  const resObj = resistenciasList.value.reduce((acc, r) => {
    if (r.key) acc[r.key] = r.value;
    return acc;
  }, {});
  return JSON.stringify({ ...form, resistencias: resObj }, null, 2);
});

function kDisplay(k) {
  const map = { for: "For", des: "Des", con: "Con", int: "Int", sab: "Sab", car: "Car" };
  return map[k] || k;
}

function addToList(field) {
  form[field].push("");
}
function removeFromList(field, i) {
  form[field].splice(i, 1);
}

function addResistencia() {
  resistenciasList.value.push({ key: "", value: "" });
}
function removeResistencia(i) {
  resistenciasList.value.splice(i, 1);
}

onMounted(async () => {
  if (props.editMode && props.id) {
    try {
      const data = await getFicha(props.id);
      Object.assign(form, data);

      // Normaliza resistências para lista
      resistenciasList.value = Object.entries(data.resistencias || {}).map(([key, value]) => ({ key, value }));
    } catch (err) {
      console.error(err);
      error.value = "Erro ao carregar ficha para edição.";
    }
  }
});

async function submit() {
  error.value = "";
  success.value = "";

  const payload = { ...form, resistencias: resistenciasList.value.reduce((acc, r) => {
    if (r.key) acc[r.key] = r.value;
    return acc;
  }, {}) };

  try {
    if (props.editMode && props.id) {
      await updateFicha(props.id, payload);
      success.value = "Ficha atualizada com sucesso!";
    } else {
      await createFicha(payload);
      success.value = "Ficha criada com sucesso!";
    }
    router.push({ name: "fichas" });
  } catch (err) {
    console.error(err);
    error.value = "Erro ao salvar ficha.";
  }
}

function cancelar() {
  router.push({ name: "fichas" });
}
</script>
