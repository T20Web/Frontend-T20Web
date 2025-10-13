<template>
  <div style="position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
    <div style="background:white; padding:16px; width:640px; max-width:95%; border-radius:8px;">
      <h3>{{ initial ? "Editar Ficha" : "Nova Ficha" }}</h3>

      <form @submit.prevent="submit">
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <label style="flex:1">
            Nome*<br/>
            <input v-model="form.nome" required />
          </label>
          <label style="flex:1">
            Raça<br/>
            <input v-model="form.raca" />
          </label>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <label style="flex:1">
            Classe<br/>
            <input v-model="form.classe" />
          </label>
          <label style="width:120px;">
            Nível*<br/>
            <input v-model.number="form.nivel" type="number" min="1" required />
          </label>
          <label style="flex:1">
            Jogador<br/>
            <input v-model="form.jogador" />
          </label>
        </div>

        <fieldset style="margin-bottom:8px;">
          <legend>Atributos (inteiros)</legend>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <label style="width:100px">For<br/>
              <input v-model.number="form.atributos['for']" type="number" required />
            </label>
            <label style="width:100px">Des<br/>
              <input v-model.number="form.atributos['des']" type="number" required />
            </label>
            <label style="width:100px">Con<br/>
              <input v-model.number="form.atributos['con']" type="number" required />
            </label>
            <label style="width:100px">Int<br/>
              <input v-model.number="form.atributos['int']" type="number" required />
            </label>
            <label style="width:100px">Sab<br/>
              <input v-model.number="form.atributos['sab']" type="number" required />
            </label>
            <label style="width:100px">Car<br/>
              <input v-model.number="form.atributos['car']" type="number" required />
            </label>
          </div>
        </fieldset>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button type="button" @click="$emit('close')">Cancelar</button>
          <button type="submit">{{ initial ? "Salvar" : "Criar" }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, toRaw } from "vue";
import { createFicha, updateFicha } from "../api";

const props = defineProps({ initial: { type: Object, default: null } });
const emits = defineEmits(["close", "saved"]);

const defaultForm = () => ({
  nome: "",
  raca: "",
  classe: "",
  nivel: 1,
  jogador: "",
  atributos: { "for": 10, "des": 10, "con": 10, "int": 10, "sab": 10, "car": 10 },
  schema_version: 1,
});

const form = reactive(defaultForm());

watch(() => props.initial, (v) => {
  if (v) {
    Object.assign(form, {
      nome: v.nome || "",
      raca: v.raca || "",
      classe: v.classe || "",
      nivel: v.nivel || 1,
      jogador: v.jogador || "",
      atributos: Object.assign(defaultForm().atributos, v.atributos || {})
    });
    form.id = v.id;
  } else {
    Object.assign(form, defaultForm());
    delete form.id;
  }
}, { immediate: true });

async function submit() {
  if (!form.nome || !form.nivel) {
    alert("Preencha Nome e Nível (>=1).");
    return;
  }
  for (const k of ["for","des","con","int","sab","car"]) {
    form.atributos[k] = parseInt(form.atributos[k]) || 0;
  }
  const payload = {
    nome: form.nome,
    raca: form.raca,
    classe: form.classe,
    nivel: parseInt(form.nivel),
    jogador: form.jogador,
    atributos: toRaw(form.atributos),
    schema_version: form.schema_version || 1
  };

  try {
    if (form.id) {
      await updateFicha(form.id, payload);
    } else {
      await createFicha(payload);
    }
    emits("saved");
  } catch (e) {
    alert("Erro ao salvar: " + (e.body?.detail || e.message));
  }
}
</script>

<style scoped>
input { padding:6px; width:100%; box-sizing:border-box; }
button { padding:8px 10px; border-radius:6px; border:1px solid #ccc; background:white; cursor:pointer; }
</style>
