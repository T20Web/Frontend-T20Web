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

        <router-link v-if="!isAuthenticated" class="btn btn-secondary" to="/login" aria-label="Entrar">Login</router-link>
        <router-link v-if="!isAuthenticated" class="btn btn-secondary" to="/register" aria-label="Registrar">Registrar</router-link>

        <button v-if="isAuthenticated" class="btn btn-danger" @click="logout">Sair</button>
      </div>

      <p class="small-muted" style="margin-top:14px;">
        Dica: faça login para acessar suas fichas privadas. Sem conta? Registre-se — é rápido.
      </p>
    </div>

    <aside class="hero-aside" aria-label="Últimas fichas">
      <div class="latest-card" role="region" aria-labelledby="latest-title">
        <h3 id="latest-title" style="margin:0 0 10px;">Últimas fichas</h3>

        <div v-if="loading" class="small-muted">Carregando...</div>
        <div v-else-if="error" style="color:var(--danger)">{{ error }}</div>

        <ul v-else style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px;">
          <li v-for="f in latest" :key="f.id" class="ficha-item" role="article">
            <div style="display:flex; flex-direction:column;">
              <strong style="font-size:0.95rem;">{{ f.title || "Ficha sem nome" }}</strong>
              <small class="small-muted">
                {{ f.classe || "-" }} | Nível {{ f.nivel ?? "?" }} | Jogador: {{ f.jogador || "-" }}
              </small>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { listFichas } from "../api";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const loading = ref(false);
const error = ref("");
const latest = ref([]);

const auth = useAuth();
const isAuthenticated = computed(() => {
  if (typeof auth.isAuthenticated === "function") {
    try { return !!auth.isAuthenticated(); } catch (_) { return false; }
  }
  if (auth.isAuthenticated && typeof auth.isAuthenticated === "object" && "value" in auth.isAuthenticated) {
    return !!auth.isAuthenticated.value;
  }
  return !!auth.isAuthenticated;
});

function logout() {
  try {
    const result = auth.logout && auth.logout();
    if (result && typeof result.then === "function") {
      result.then(() => router.push("/login")).catch(() => router.push("/login"));
    } else {
      router.push("/login");
    }
  } catch {
    router.push("/login");
  }
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const data = await listFichas();

    // normaliza e pega últimos 3 fichas
    let fichas = [];
    if (Array.isArray(data.results)) fichas = data.results;
    else if (Array.isArray(data)) fichas = data;
    else fichas = [];

    latest.value = fichas
      .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0,3)
      .map(f => ({
        id: f.id,
        title: f.nome || f.title || `Ficha ${f.id}`,
        classe: f.classe || "-",
        nivel: f.nivel ?? "?",
        jogador: f.jogador || "-",
        description: f.descricao || f.description || ""
      }));

  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar últimas fichas.";
    latest.value = [];
  } finally {
    loading.value = false;
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
.hero {
  opacity: 0;
  transform: translateY(8px);
  transition: all .36s ease;
}
.hero.in {
  opacity: 1;
  transform: translateY(0);
}
</style>
