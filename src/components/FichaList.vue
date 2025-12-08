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

    // Normaliza formatos: array, paginado {results:[]}, {data: []}, ou objeto único
    let items = [];
    if (Array.isArray(data)) {
      items = data;
    } else if (data && Array.isArray(data.results)) {
      items = data.results;
    } else if (data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data && typeof data === "object") {
      // Se veio um objeto único, tenta extrair lista ou transforma em lista única
      if (data.items && Array.isArray(data.items)) {
        items = data.items;
      } else {
        items = [data];
      }
    } else {
      items = [];
    }

    fichas.value = items.map(d => ({
      // normaliza id: id, pk, id_ficha, etc.
      id: d.id ?? d.pk ?? d.id_ficha ?? d.pk_ficha ?? null,
      title: d.title ?? d.name ?? d.titulo ?? "",
      description: d.description ?? d.desc ?? d.descricao ?? ""
      // mantenha outros campos se precisar
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

function novo() {
  router.push({ name: "fichas-nova" }); 
}

onMounted(load);
</script>
