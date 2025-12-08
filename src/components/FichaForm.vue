<!-- src/components/FichaForm.vue -->
<template>
  <section style="max-width:640px;">
    <h2>{{ isEdit ? "Editar ficha" : "Criar ficha" }}</h2>

    <form @submit.prevent="submit">
      <div style="margin-bottom:8px;">
        <label for="title">Título</label><br/>
        <input id="title" v-model="form.title" required />
      </div>

      <div style="margin-bottom:8px;">
        <label for="description">Descrição</label><br/>
        <textarea id="description" v-model="form.description" rows="4"></textarea>
      </div>

      <div style="margin-bottom:8px;">
        <label for="attributes">Atributos (JSON ou texto)</label><br/>
        <textarea id="attributes" v-model="form.attributes" rows="6"></textarea>
      </div>

      <div style="margin-top:12px;">
        <button type="submit">{{ isEdit ? "Salvar" : "Criar" }}</button>
      </div>
    </form>

    <div v-if="loading" style="margin-top:8px;">Salvando...</div>
    <div v-if="error" style="color:tomato; margin-top:8px;">{{ error }}</div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createFicha, getFicha, updateFicha } from "../api";

const route = useRoute();
const router = useRouter();

const isEdit = ref(Boolean(route.params.id));
const loading = ref(false);
const error = ref("");

const form = ref({
  title: "",
  description: "",
  attributes: "",
});

async function load() {
  if (!isEdit.value) return;
  loading.value = true;
  try {
    const data = await getFicha(route.params.id);
    // Preenche o form (adaptar campos conforme API)
    form.value.title = data.title || "";
    form.value.description = data.description || "";
    // attributes pode ser objeto; converte para string
    form.value.attributes = typeof data.attributes === "object" ? JSON.stringify(data.attributes, null, 2) : (data.attributes || "");
  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar ficha para edição.";
  } finally {
    loading.value = false;
  }
}

async function submit() {
  loading.value = true;
  error.value = "";
  try {
    // Tenta parse do attributes (se for JSON)
    let payload = { title: form.value.title, description: form.value.description };
    try {
      payload.attributes = JSON.parse(form.value.attributes);
    } catch {
      payload.attributes = form.value.attributes; // envia como texto se não for JSON
    }

    if (isEdit.value) {
      await updateFicha(route.params.id, payload);
      alert("Ficha atualizada com sucesso.");
      router.push({ name: "fichaDetail", params: { id: route.params.id } });
    } else {
      await createFicha(payload);
      alert("Ficha criada com sucesso.");
      router.push({ name: "fichas" });
    }
  } catch (err) {
    console.error(err);
    error.value = "Erro ao salvar ficha.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);

/* Mock local:
   Se quiser testar sem backend, substitua createFicha/updateFicha por await new Promise(r=>setTimeout(r,500));
*/
</script>
