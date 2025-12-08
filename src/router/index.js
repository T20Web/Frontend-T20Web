import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import FichaList from "../components/FichaList.vue";
import FichaDetail from "../components/FichaDetail.vue";
import FichaForm from "../components/FichaForm.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },

  // Listagem de fichas
  { path: "/fichas", name: "fichas", component: FichaList },

  // Detalhe da ficha
  { 
    path: "/fichas/:id", 
    name: "fichaDetail", 
    component: FichaDetail,
    props: true
  },

  // Criar nova ficha
  { 
    path: "/fichas/nova", 
    name: "fichaNova", 
    component: FichaForm 
  },

  // Editar ficha ─ ROTA QUE FALTAVA
  { 
    path: "/fichas/:id/editar", 
    name: "fichaEditar", 
    component: FichaForm,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
