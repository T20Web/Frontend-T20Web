<!-- src/components/FichaDetail.vue -->
<template>
  <section style="max-width:800px; margin:auto; padding:16px;">
    <div v-if="loading" class="small-muted">Carregando ficha...</div>
    <div v-else-if="error" style="color:tomato">{{ error }}</div>

    <div v-else-if="ficha">
      <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h2>{{ ficha.nome || "Ficha sem nome" }} <small v-if="ficha.nivel">(Nível {{ ficha.nivel }})</small></h2>
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" @click="editar">Editar</button>
          <button class="btn" @click="voltar">Voltar</button>
        </div>
      </header>

      <section style="margin-bottom:12px;">
        <p><strong>Descrição:</strong> {{ ficha.descricao || ficha.description || "Nenhuma descrição" }}</p>
        <p><strong>Jogador:</strong> {{ ficha.jogador || "Não definido" }}</p>
        <p><strong>Raça / Classe / Tendência:</strong> 
          {{ ficha.raca || "?" }} / {{ ficha.classe || "?" }} / {{ ficha.tendencia || "?" }}
        </p>
        <p v-if="ficha.pv_max !== null && ficha.pv_atual !== null">
          <strong>PV:</strong> {{ ficha.pv_atual }}/{{ ficha.pv_max }}
        </p>
      </section>

      <section style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px;">
        <div style="flex:1; min-width:150px;">
          <h3>Atributos</h3>
          <ul>
            <li v-for="(value, key) in ficha.atributos" :key="key">
              <strong>{{ key.toUpperCase() }}:</strong> {{ value }}
            </li>
          </ul>
        </div>

        <div style="flex:1; min-width:150px;">
          <h3>Resistências</h3>
          <ul v-if="ficha.resistencias && Object.keys(ficha.resistencias).length">
            <li v-for="(value, key) in ficha.resistencias" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
          <p v-else class="small-muted">Nenhuma resistência</p>
        </div>
      </section>

      <section style="margin-bottom:12px;">
        <h3>Perícias</h3>
        <ul v-if="ficha.pericias && ficha.pericias.length">
          <li v-for="p in ficha.pericias" :key="p">{{ p }}</li>
        </ul>
        <p v-else class="small-muted">Nenhuma perícia</p>
      </section>

      <section style="margin-bottom:12px;">
        <h3>Poderes</h3>
        <ul v-if="ficha.poderes && ficha.poderes.length">
          <li v-for="p in ficha.poderes" :key="p">{{ p }}</li>
        </ul>
        <p v-else class="small-muted">Nenhum poder</p>
      </section>

      <section style="margin-bottom:12px;">
        <h3>Magias</h3>
        <ul v-if="ficha.magias && ficha.magias.length">
          <li v-for="m in ficha.magias" :key="m">{{ m }}</li>
        </ul>
        <p v-else class="small-muted">Nenhuma magia</p>
      </section>

      <section style="margin-bottom:12px;">
        <h3>Equipamentos</h3>
        <ul v-if="ficha.equipamentos && ficha.equipamentos.length">
          <li v-for="e in ficha.equipamentos" :key="e">{{ e }}</li>
        </ul>
        <p v-else class="small-muted">Nenhum equipamento</p>
      </section>

      <section style="margin-bottom:12px;">
        <h3>Anotações</h3>
        <p>{{ ficha.anotacoes || "Nenhuma anotação" }}</p>
      </section>
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
  loading.value = true;
  error.value = "";
  try {
    ficha.value = await getFicha(route.params.id);
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

function voltar() {
  router.push({ name: "fichas" });
}

onMounted(load);
</script>

<style scoped>
h2 small {
  font-weight: normal;
  color: #666;
}
section h3 {
  margin: 8px 0 4px;
}
ul {
  margin:0; padding:0; list-style:none;
}
ul li {
  margin:2px 0;
}
</style>
