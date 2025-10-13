<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <header style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <h3 style="margin:0">{{ ficha.nome }} <small style="font-weight:400">— Nível {{ ficha.nivel }}</small></h3>
        <button @click="close">Fechar</button>
      </header>

      <section style="margin-top:12px;">
        <div><strong>Raça:</strong> {{ ficha.raca || "—" }}</div>
        <div><strong>Classe:</strong> {{ ficha.classe || "—" }}</div>
        <div><strong>Jogador:</strong> {{ ficha.jogador || "—" }}</div>
        <div style="margin-top:8px;"><strong>PV:</strong> {{ ficha.pv_atual ?? "—" }} / {{ ficha.pv_max ?? "—" }}</div>
        <div style="margin-top:8px;"><strong>Defesa:</strong> {{ ficha.defesa || "—" }}</div>
      </section>

      <section style="margin-top:12px;">
        <strong>Atributos</strong>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
          <div v-for="(val,key) in ficha.atributos || {}" :key="key" style="min-width:90px;">
            <div style="font-size:12px; color:#6b7280; text-transform:uppercase">{{ key }}</div>
            <div style="font-weight:700">{{ val }}</div>
          </div>
        </div>
      </section>

      <section v-if="ficha.anotacoes" style="margin-top:12px;">
        <strong>Anotações</strong>
        <div style="white-space:pre-wrap; margin-top:6px;">{{ ficha.anotacoes }}</div>
      </section>

      <footer style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
        <slot name="actions"></slot>
        <button @click="close">Fechar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({ ficha: { type: Object, required: true } });
const emit = defineEmits(["close"]);
function close() { emit("close"); }
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); z-index:999;
}
.modal { background:white; padding:16px; border-radius:10px; width:90%; max-width:640px; }
button { padding:6px 10px; border-radius:8px; cursor:pointer; }
</style>
