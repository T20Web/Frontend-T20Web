import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import FichaList from "../components/FichaList.vue";
import FichaForm from "../components/FichaForm.vue";
import FichaDetail from "../components/FichaDetail.vue";
import { useAuth } from "../composables/useAuth";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  {
    path: "/fichas",
    name: "fichas",
    component: FichaList,
    meta: { requiresAuth: true },
  },
  {
    path: "/fichas/:id",
    name: "fichas-detail",
    component: FichaDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/fichas/:id/editar",
    name: "fichas-editar",
    component: FichaForm,
    props: (route) => ({ id: route.params.id, editMode: true }),
    meta: { requiresAuth: true },
  },
  {
    path: "/ficha/nova",
    name: "fichas-nova",
    component: FichaForm,
    props: { editMode: false },
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuth();
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    next({ name: "login", query: { next: to.fullPath } });
  } else {
    next();
  }
});

export default router;
