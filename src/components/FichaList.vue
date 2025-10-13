<template>
  <div>
    <div v-if="!fichas.length">Nenhuma ficha encontrada.</div>
    <ul>
      <li v-for="f in fichas" :key="f.id" style="margin-bottom:8px; padding:8px; border:1px solid #eee; border-radius:6px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>{{ f.nome }}</strong> — {{ f.classe || "—" }} — Nível {{ f.nivel }}
            <div style="font-size:12px; color:#666">{{ f.raca || "" }} • Jogador: {{ f.jogador || "—" }}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button @click="$emit('edit', f)">Editar</button>
            <button @click="$emit('export', f.id)">Export</button>
            <button @click="$emit('delete', f.id)">Apagar</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ fichas: { type: Array, default: () => [] } });
</script>

<style scoped>
button {
  padding:6px 8px;
  border-radius:6px;
  border:1px solid #ccc;
  background:white;
  cursor:pointer;
}
</style>
