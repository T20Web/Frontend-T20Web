<template>
  <section class="container">
    <div class="card">
      <header class="card-header">
        <h2 class="title">{{ editMode ? "Editar Ficha" : "Criar Ficha" }}</h2>
      </header>

      <form class="form" @submit.prevent="submit">
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>

        <!-- Dados básicos -->
        <div class="grid two">
          <div class="field">
            <label class="label">Nome *</label>
            <input class="input" v-model="form.nome" required />
          </div>

          <div class="field">
            <label class="label">Raça</label>
            <input class="input" v-model="form.raca" />
          </div>

          <div class="field">
            <label class="label">Classe</label>
            <input class="input" v-model="form.classe" />
          </div>

          <div class="field">
            <label class="label">Tendência</label>
            <input class="input" v-model="form.tendencia" />
          </div>

          <div class="field full">
            <label class="label">Jogador</label>
            <input class="input" v-model="form.jogador" />
          </div>
        </div>

        <!-- Atributos -->
        <fieldset class="card-section">
          <legend class="legend">Atributos (obrigatórios)</legend>
          <div class="grid attrs">
            <div v-for="k in attrKeys" :key="k" class="attr-item">
              <label class="sublabel">{{ kDisplay(k) }}</label>
              <input class="input input-number" type="number" min="0" v-model.number="form.atributos[k]" />
            </div>
          </div>
        </fieldset>

        <!-- Campos flexíveis -->
        <fieldset class="card-section">
          <legend class="legend">Perícias</legend>
          <div class="list">
            <div v-for="(p,i) in form.pericias" :key="'p'+i" class="list-row">
              <input class="input" v-model="form.pericias[i]" placeholder="Ex: Atletismo +3" />
              <button class="btn small btn-remove" type="button" @click="removeFromList('pericias', i)">Rem</button>
            </div>
            <button class="btn outline" type="button" @click="addToList('pericias')">+ Adicionar perícia</button>
          </div>
        </fieldset>

        <fieldset class="card-section">
          <legend class="legend">Poderes</legend>
          <div class="list">
            <div v-for="(p,i) in form.poderes" :key="'pow'+i" class="list-row">
              <input class="input" v-model="form.poderes[i]" placeholder="Nome / descrição" />
              <button class="btn small btn-remove" type="button" @click="removeFromList('poderes', i)">Rem</button>
            </div>
            <button class="btn outline" type="button" @click="addToList('poderes')">+ Adicionar poder</button>
          </div>
        </fieldset>

        <fieldset class="card-section">
          <legend class="legend">Magias</legend>
          <div class="list">
            <div v-for="(m,i) in form.magias" :key="'m'+i" class="list-row">
              <input class="input" v-model="form.magias[i]" placeholder="Nome / nível" />
              <button class="btn small btn-remove" type="button" @click="removeFromList('magias', i)">Rem</button>
            </div>
            <button class="btn outline" type="button" @click="addToList('magias')">+ Adicionar magia</button>
          </div>
        </fieldset>

        <fieldset class="card-section">
          <legend class="legend">Equipamentos</legend>
          <div class="list">
            <div v-for="(e,i) in form.equipamentos" :key="'e'+i" class="list-row">
              <input class="input" v-model="form.equipamentos[i]" placeholder="Ex: Espada longa" />
              <button class="btn small btn-remove" type="button" @click="removeFromList('equipamentos', i)">Rem</button>
            </div>
            <button class="btn outline" type="button" @click="addToList('equipamentos')">+ Adicionar equipamento</button>
          </div>
        </fieldset>

        <!-- PV / Defesa / Deslocamento -->
        <div class="grid three">
          <div class="field">
            <label class="label">PV Atual</label>
            <input class="input input-number" type="number" v-model.number="form.pv_atual" />
          </div>
          <div class="field">
            <label class="label">PV Máx</label>
            <input class="input input-number" type="number" v-model.number="form.pv_max" />
          </div>
          <div class="field">
            <label class="label">Defesa</label>
            <input class="input" v-model="form.defesa" />
          </div>
        </div>

        <div class="field">
          <label class="label">Deslocamento</label>
          <input class="input" v-model="form.deslocamento" />
        </div>

        <!-- Resistências -->
        <fieldset class="card-section">
          <legend class="legend">Resistências</legend>
          <div v-for="(r,i) in resistenciasList" :key="'r'+i" class="res-row">
            <input class="input" v-model="resistenciasList[i].key" placeholder="Tipo" />
            <input class="input" v-model="resistenciasList[i].value" placeholder="Valor / nota" />
            <button class="btn small btn-remove" type="button" @click="removeResistencia(i)">Rem</button>
          </div>
          <button class="btn outline" type="button" @click="addResistencia()">+ Adicionar resistência</button>
        </fieldset>

        <!-- Anotações -->
        <div class="field">
          <label class="label">Anotações</label>
          <textarea class="textarea" v-model="form.anotacoes" rows="4"></textarea>
        </div>

        <div class="actions">
          <button class="btn primary" type="submit">{{ editMode ? "Atualizar ficha" : "Criar ficha" }}</button>
          <button class="btn" type="button" @click="cancelar">Cancelar</button>
        </div>
      </form>

      <section class="preview">
        <h3 class="preview-title">Preview JSON</h3>
        <pre class="preview-box">{{ previewJson }}</pre>
      </section>
    </div>
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

<style scoped>
:root{
  --bg: #0f1724;
  --card: #0b1220;
  --accent: #7c3aed;
  --muted: #9aa4b2;
  --success: #0ea5a4;
  --danger: #f97373;
  --glass: rgba(255,255,255,0.03);
}

.container{
  max-width: 920px;
  margin: 20px auto;
  padding: 16px;
}

.card{
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.6);
}

.card-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:12px;
}

.title{
  font-size:20px;
  margin:0;
  color:var(--accent);
}

.form{ display:block }

.alert{ padding:10px 12px; border-radius:8px; margin-bottom:12px; font-weight:600 }
.alert-error{ background: rgba(249,115,115,0.12); color:var(--danger); border:1px solid rgba(249,115,115,0.12) }
.alert-success{ background: rgba(14,165,164,0.06); color:var(--success); border:1px solid rgba(14,165,164,0.08) }

.grid{ display:grid; gap:12px }
.grid.two{ grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) }
.grid.three{ grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) }

.field{ display:flex; flex-direction:column }
.field.full{ grid-column: 1 / -1 }

.label{ font-size:13px; margin-bottom:6px; color:var(--muted) }
.sublabel{ font-size:12px; margin-bottom:6px; color:#cbd5e1 }

.input, .textarea{
  border-radius:8px;
  padding:8px 10px;
  border:1px solid rgba(255,255,255,0.04);
  background: var(--glass);
  outline:none;
  color:#e6eef6;
  font-size:14px;
}
.input:focus, .textarea:focus{ box-shadow: 0 0 0 4px rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.6) }
.input-number{ max-width:120px }
.textarea{ resize:vertical }

.card-section{ margin:10px 0; padding:12px; border-radius:10px; background: rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.02) }
.legend{ font-weight:700; color:#cbd5e1; margin-bottom:8px }

.attrs{ grid-template-columns: repeat(6, minmax(0,1fr)); gap:8px }
.attr-item{ display:flex; flex-direction:column; align-items:flex-start }

.list{ display:flex; flex-direction:column; gap:8px }
.list-row{ display:flex; gap:8px; align-items:center }
.res-row{ display:flex; gap:8px; align-items:center; margin-bottom:6px }

.btn{ padding:8px 12px; border-radius:8px; background:transparent; border:1px solid rgba(255,255,255,0.04); cursor:pointer; font-weight:600 }
.btn:hover{ transform:translateY(-1px); box-shadow:0 6px 18px rgba(2,6,23,0.4) }
.btn.primary{ background: linear-gradient(90deg,var(--accent), #5b21b6); color:white; border:none }
.btn.outline{ background:transparent }
.btn.small{ padding:6px 8px; font-size:13px }
.btn-remove{ background: transparent; border:1px dashed rgba(255,255,255,0.04) }

.actions{ display:flex; gap:8px; margin-top:12px }

.preview{ margin-top:14px }
.preview-title{ font-size:13px; color:var(--muted); margin-bottom:8px }
.preview-box{ background:#071025; padding:12px; border-radius:8px; color:#dbeafe; max-height:280px; overflow:auto; white-space:pre-wrap }

@media (max-width:640px){
  .attrs{ grid-template-columns: repeat(3, 1fr) }
  .grid.two{ grid-template-columns: 1fr }
}
</style>
