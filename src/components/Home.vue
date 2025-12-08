<!-- src/components/Home.vue -->
<template>
  <section class="hero" aria-labelledby="hero-title">
    <div style="flex:1; min-width:220px;">
      <div class="hero-badge" aria-hidden="true">Bem-vindo</div>

      <h2 id="hero-title" class="hero-title">Gerencie suas fichas com rapidez</h2>

      <p class="hero-sub">
        Crie, edite e organize fichas de personagem — atributos, histórico e exportação simples. 
        Tudo em um lugar leve e prático para mestrar e jogar.
      </p>

      <div class="hero-ctas" style="margin-top:8px;">
        <router-link class="btn" to="/fichas" aria-label="Ver fichas">Ver fichas</router-link>
      <router-link class="btn btn-secondary" to="/login" aria-label="Entrar">Login</router-link>
      <router-link class="btn btn-secondary" to="/register" aria-label="Registrar">Registrar</router-link>

      </div>

      <p class="small-muted" style="margin-top:14px;">Dica: faça login para acessar suas fichas privadas. Sem conta? Registre-se — é rápido.</p>
    </div>

    <aside class="hero-aside" aria-label="Últimas fichas">
      <div class="latest-card" role="region" aria-labelledby="latest-title">
        <h3 id="latest-title" style="margin:0 0 10px;">Últimas fichas</h3>

        <div v-if="loading" class="small-muted">Carregando...</div>
        <div v-else-if="error" style="color:var(--danger)">{{ error }}</div>

        <ul v-else style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px;">
          <li v-for="f in latest" :key="f.id" class="ficha-item" role="article">
            <div style="display:flex; flex-direction:column;">
              <strong style="font-size:0.95rem;">{{ f.title }}</strong>
              <small class="small-muted">{{ f.subtitle }}</small>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              <button class="btn-secondary" @click="ver(f.id)" aria-label="Ver ficha">Ver</button>
            </div>
          </li>

          <li v-if="!latest.length" class="small-muted">Nenhuma ficha encontrada.</li>
        </ul>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
        <div>
          <div class="small-muted" style="font-size:0.85rem;">Comece agora</div>
          <div style="font-weight:700;">Crie sua primeira ficha</div>
        </div>
        <router-link to="/ficha/nova" class="btn" aria-label="Criar ficha">Criar</router-link>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listFichas } from "../api";

const router = useRouter();
const loading = ref(false);
const error = ref("");
const latest = ref([]);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const data = await listFichas();
    // tenta normalizar: pega os últimos 3
    if (Array.isArray(data)) {
      latest.value = data.slice(0, 3).map(item => ({
        id: item.id,
        title: item.title || item.name || `Ficha ${item.id}`,
        subtitle: item.description ? item.description.slice(0, 40) : (item.subtitle || "")
      }));
    } else {
      latest.value = [];
    }
  } catch (err) {
    console.error(err);
    error.value = err.message || "Erro ao carregar últimas fichas.";
    // fallback mock para não deixar vazio
    latest.value = [
      { id: "m-1", title: "Ficha Exemplo", subtitle: "Teste local" },
      { id: "m-2", title: "Mago Sombrio", subtitle: "NPC" },
      { id: "m-3", title: "Aventureiro X", subtitle: "RPG" },
    ];
  } finally {
    loading.value = false;
    // animação: adiciona classe in para fade-up (aplica ao container inteiro)
    setTimeout(() => {
      const el = document.querySelector(".hero");
      if (el) el.classList.add("in");
    }, 80);
  }
}

function ver(id) {
  router.push({ name: "fichaDetail", params: { id } });
}

onMounted(load);
</script>

<style scoped>
.hero { opacity:0; transform:translateY(8px); transition:all .36s ease; }
.hero.in { opacity:1; transform:translateY(0); }
</style>
