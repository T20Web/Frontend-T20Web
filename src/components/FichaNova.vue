<template>
  <main class="ficha-page">
    <section class="ficha-card" role="main" aria-labelledby="ficha-title">
      <div class="header-row">
        <div>
          <h1 id="ficha-title">Nova Ficha</h1>
          <p class="small-muted">Preencha os campos e salve sua ficha.</p>
        </div>
        <div>
          <router-link to="/fichas" class="link-muted">Voltar</router-link>
        </div>
      </div>

      <form class="form" @submit.prevent="submit" novalidate>
        <div v-if="error" class="alert" role="alert">{{ error }}</div>
        <div v-if="success" class="success" role="status">{{ success }}</div>

        <div class="grid-3">
          <label class="field">
            <span class="label-text">Nome *</span>
            <input v-model.trim="form.nome" placeholder="Nome do personagem" required />
          </label>

          <label class="field">
            <span class="label-text">Nível *</span>
            <input type="number" min="1" v-model.number="form.nivel" />
          </label>

          <label class="field">
            <span class="label-text">Raça</span>
            <input v-model.trim="form.raca" placeholder="Humano, Elfo..." />
          </label>
        </div>

        <div class="grid-3">
          <label class="field">
            <span class="label-text">Classe</span>
            <input v-model.trim="form.classe" placeholder="Guerreiro, Mago..." />
          </label>

          <label class="field">
            <span class="label-text">Tendência</span>
            <input v-model.trim="form.tendencia" placeholder="Neutro, Caótico..." />
          </label>

          <label class="field">
            <span class="label-text">Jogador</span>
            <input v-model.trim="form.jogador" placeholder="Seu nome" />
          </label>
        </div>

        <fieldset class="attrs">
          <legend>Atributos (obrigatórios)</legend>
          <div class="grid-6">
            <label v-for="k in attrKeys" :key="k" class="attr-field">
              <div class="label-text small-uppercase">{{ kDisplay(k) }}</div>
              <input type="number" min="0" v-model.number="form.atributos[k]" />
            </label>
          </div>
        </fieldset>

        <div class="grid-2">
          <fieldset class="flexible">
            <legend>Perícias</legend>
            <div v-for="(p, i) in form.pericias" :key="'p'+i" class="list-row">
              <input v-model="form.pericias[i]" placeholder="Ex: Atletismo +3" />
              <button type="button" class="btn-ghost" @click="removeFromList('pericias', i)">Rem</button>
            </div>
            <button type="button" class="btn-link" @click="addToList('pericias')">+ Adicionar perícia</button>
          </fieldset>

          <fieldset class="flexible">
            <legend>Poderes</legend>
            <div v-for="(p, i) in form.poderes" :key="'pow'+i" class="list-row">
              <input v-model="form.poderes[i]" placeholder="Nome do poder / descrição" />
              <button type="button" class="btn-ghost" @click="removeFromList('poderes', i)">Rem</button>
            </div>
            <button type="button" class="btn-link" @click="addToList('poderes')">+ Adicionar poder</button>
          </fieldset>
        </div>

        <div class="grid-2">
          <fieldset class="flexible">
            <legend>Magias</legend>
            <div v-for="(m, i) in form.magias" :key="'m'+i" class="list-row">
              <input v-model="form.magias[i]" placeholder="Nome da magia / nível" />
              <button type="button" class="btn-ghost" @click="removeFromList('magias', i)">Rem</button>
            </div>
            <button type="button" class="btn-link" @click="addToList('magias')">+ Adicionar magia</button>
          </fieldset>

          <fieldset class="flexible">
            <legend>Equipamentos</legend>
            <div v-for="(e, i) in form.equipamentos" :key="'e'+i" class="list-row">
              <input v-model="form.equipamentos[i]" placeholder="Espada longa, mochila..." />
              <button type="button" class="btn-ghost" @click="removeFromList('equipamentos', i)">Rem</button>
            </div>
            <button type="button" class="btn-link" @click="addToList('equipamentos')">+ Adicionar equipamento</button>
          </fieldset>
        </div>

        <div class="grid-3">
          <label class="field">
            <span class="label-text">PV Atual</span>
            <input type="number" v-model.number="form.pv_atual" placeholder="Ex: 8" />
          </label>
          <label class="field">
            <span class="label-text">PV Máx</span>
            <input type="number" v-model.number="form.pv_max" placeholder="Ex: 12" />
          </label>
          <label class="field">
            <span class="label-text">Defesa</span>
            <input v-model.trim="form.defesa" placeholder="Ex: CA 15" />
          </label>
        </div>

        <div class="grid-2">
          <label class="field">
            <span class="label-text">Deslocamento</span>
            <input v-model.trim="form.deslocamento" placeholder="6m, 9m..." />
          </label>

          <fieldset class="flexible">
            <legend>Resistências</legend>
            <div v-for="(r, i) in resistenciasList" :key="'r'+i" class="list-row">
              <input v-model="resistenciasList[i].key" placeholder="Tipo (Ex: Fogo)" class="w-40" />
              <input v-model="resistenciasList[i].value" placeholder="Valor/nota" class="flex-1" />
              <button type="button" class="btn-ghost" @click="removeResistencia(i)">Rem</button>
            </div>
            <button type="button" class="btn-link" @click="addResistencia()">+ Adicionar resistência</button>
          </fieldset>
        </div>

        <label class="field">
          <span class="label-text">Anotações</span>
          <textarea v-model="form.anotacoes" rows="4" placeholder="Notas, histórico, descrição..."></textarea>
        </label>

        <div class="actions">
          <button class="btn primary" :disabled="loading">
            <span v-if="!loading">Salvar ficha</span>
            <span v-else class="spinner" aria-hidden></span>
          </button>

          <button type="button" class="btn neutral" @click="resetForm">Limpar</button>

          <router-link to="/fichas" class="link-muted">Cancelar</router-link>
        </div>

        <div class="preview">
          <div class="small-muted">Preview JSON</div>
          <pre>{{ previewJson }}</pre>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const auth = useAuth();

const defaultAttributes = { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 };
const attrKeys = ["for", "des", "con", "int", "sab", "car"];

const form = reactive({
  nome: "",
  raca: "",
  classe: "",
  nivel: 1,
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
  resistencias: {}, // será convertido a partir de resistenciasList
  schema_version: 1,
});

const resistenciasList = ref([]); // { key, value } pairs
const loading = ref(false);
const error = ref("");
const success = ref("");

// helper computed preview
const previewJson = computed(() => {
  const resistenciasObj = resistenciasList.value.reduce((acc, r) => {
    if (r && r.key) acc[r.key] = r.value;
    return acc;
  }, {});
  return JSON.stringify({ ...form, resistencias: resistenciasObj }, null, 2);
});

function kDisplay(k) {
  const map = { for: "For", des: "Des", con: "Con", int: "Int", sab: "Sab", car: "Car" };
  return map[k] || k;
}

function addToList(field) {
  if (!Array.isArray(form[field])) form[field] = [];
  form[field].push("");
}
function removeFromList(field, i) {
  if (!Array.isArray(form[field])) return;
  form[field].splice(i, 1);
}

function addResistencia() {
  resistenciasList.value.push({ key: "", value: "" });
}
function removeResistencia(i) {
  resistenciasList.value.splice(i, 1);
}

function resetForm() {
  form.nome = "";
  form.raca = "";
  form.classe = "";
  form.nivel = 1;
  form.tendencia = "";
  form.jogador = "";
  form.atributos = { ...defaultAttributes };
  form.pericias = [];
  form.poderes = [];
  form.magias = [];
  form.equipamentos = [];
  form.anotacoes = "";
  form.pv_atual = null;
  form.pv_max = null;
  form.defesa = "";
  form.deslocamento = "";
  resistenciasList.value = [];
  error.value = "";
  success.value = "";
}

// basic validation similar to serializer rules
function validatePayload(payload) {
  if (!payload.nome || String(payload.nome).trim().length === 0) return "Nome é obrigatório.";
  if (!payload.nivel || Number(payload.nivel) < 1) return "Nível deve ser >= 1.";
  const attrs = payload.atributos || {};
  const required = ["for", "des", "con", "int", "sab", "car"];
  for (const r of required) {
    if (attrs[r] === undefined || attrs[r] === null || Number.isNaN(Number(attrs[r]))) {
      return `Atributo ${r} inválido.`;
    }
  }
  return null;
}

async function submit() {
  error.value = "";
  success.value = "";
  const resistenciasObj = resistenciasList.value.reduce((acc, r) => {
    if (r && r.key) acc[r.key] = r.value;
    return acc;
  }, {});
  const payload = {
    nome: form.nome,
    raca: form.raca,
    classe: form.classe,
    nivel: Number(form.nivel) || 1,
    tendencia: form.tendencia,
    jogador: form.jogador,
    atributos: { ...form.atributos },
    pericias: form.pericias.filter(Boolean),
    poderes: form.poderes.filter(Boolean),
    magias: form.magias.filter(Boolean),
    equipamentos: form.equipamentos.filter(Boolean),
    anotacoes: form.anotacoes,
    pv_atual: form.pv_atual === null ? null : Number(form.pv_atual),
    pv_max: form.pv_max === null ? null : Number(form.pv_max),
    defesa: form.defesa,
    deslocamento: form.deslocamento,
    resistencias: resistenciasObj,
    schema_version: form.schema_version,
  };

  const verror = validatePayload(payload);
  if (verror) {
    error.value = verror;
    return;
  }

  loading.value = true;
  try {
    // build headers: accept token if available (token or getToken)
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      // try common token exports
      if (auth.token) headers["Authorization"] = `Bearer ${auth.token}`;
      else if (typeof auth.getToken === "function") {
        const t = auth.getToken();
        if (t) headers["Authorization"] = `Bearer ${t}`;
      } else if (auth.getCurrentToken && typeof auth.getCurrentToken === "function") {
        const t = auth.getCurrentToken();
        if (t) headers["Authorization"] = `Bearer ${t}`;
      }
    }

    const resp = await fetch("/api/fichas/", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const contentType = resp.headers.get("content-type") || "";
      let msg = `Erro ${resp.status}`;
      try {
        if (contentType.includes("application/json")) {
          const data = await resp.json();
          msg = data.detail || JSON.stringify(data);
        } else {
          msg = await resp.text();
        }
      } catch (e) {
        // ignore parsing error
      }
      throw new Error(msg);
    }

    const data = await resp.json();
    success.value = "Ficha criada com sucesso!";
    // optional: navigate to list or detail
    router.push({ name: "fichas" }).catch(() => (window.location.href = "/fichas"));
  } catch (err) {
    console.error(err);
    error.value = err.message || "Erro ao salvar ficha.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
:root{
  --card-bg: #ffffff;
  --muted: #6f737a;
  --primary: #b7282c;
  --accent: #ffffff; /* neutro, sem amarelado */
  --danger: #e05a5a;
  --shadow: 0 6px 24px rgba(18,18,20,0.06);
}

/* layout */
.ficha-page { display:flex; align-items:flex-start; justify-content:center; padding:24px; }
.ficha-card { width:100%; max-width:1024px; background:var(--card-bg); border-radius:12px; padding:20px; box-shadow:var(--shadow); border:1px solid rgba(0,0,0,0.04); }
.header-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.small-muted { color:var(--muted); font-size:0.95rem; margin:0; }

.form { display:flex; flex-direction:column; gap:12px; }
.grid-3 { display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; }
.grid-2 { display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; }
.grid-6 { display:grid; grid-template-columns: repeat(6, 1fr); gap:8px; }

.field { display:flex; flex-direction:column; gap:6px; }
.label-text { font-weight:700; font-size:0.85rem; color:var(--muted); }
.input-wrap { display:flex; align-items:center; gap:8px; border-radius:8px; background:var(--accent); padding:8px 10px; border:1px solid #e6e6e6; }
.input-wrap input { flex:1; border:0; background:transparent; outline:none; padding:6px 0; font-size:1rem; color:var(--text); }

/* attributes */
.attrs { border:1px solid rgba(0,0,0,0.04); padding:12px; border-radius:10px; background: #fbfbfb; }
.attr-field { display:flex; flex-direction:column; gap:6px; text-align:center; }

/* flexible lists */
.flexible { border:1px dashed rgba(0,0,0,0.04); padding:10px; border-radius:8px; background:#fff; }
.list-row { display:flex; gap:8px; margin-bottom:8px; align-items:center; }
.list-row input { flex:1; padding:8px; border-radius:8px; border:1px solid #eee; }

/* buttons */
.actions { display:flex; gap:12px; align-items:center; margin-top:6px; }
.btn { padding:10px 14px; border-radius:10px; font-weight:700; cursor:pointer; border:0; }
.btn.primary { background:var(--primary); color:white; box-shadow: 0 8px 20px rgba(183,40,44,0.08); }
.btn.neutral { background:#f3f3f4; color:var(--muted); font-weight:700; border:1px solid rgba(0,0,0,0.03); }
.btn-link { background:none; border:0; color:var(--primary); cursor:pointer; font-weight:700; }
.btn-ghost { background:#fff; border:1px solid #eee; padding:6px 8px; border-radius:8px; cursor:pointer; }

/* alerts */
.alert { background:#fff2f2; border:1px solid var(--danger); color:var(--danger); padding:10px; border-radius:8px; font-weight:600; }
.success { background:#f2fff6; border:1px solid #8fd6a3; color:#1f7f40; padding:10px; border-radius:8px; font-weight:600; }

/* preview */
.preview { margin-top:12px; background:#fafafa; padding:10px; border-radius:8px; border:1px solid #efefef; }
.preview pre { margin:0; font-size:0.85rem; max-height:240px; overflow:auto; }

/* spinner */
.spinner { width:16px; height:16px; border-radius:50%; display:inline-block; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.18); position:relative; }
.spinner::after { content:""; position:absolute; inset:0; border-radius:50%; border:2px solid rgba(255,255,255,0.6); border-top-color: transparent; animation:spin .9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* responsive */
@media (max-width: 900px) {
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .grid-6 { grid-template-columns: repeat(3, 1fr); }
}
</style>
