import { createApp } from "vue";
import App from "./App.vue";
import router from './router'
import "./style.css";
import { getInitialTheme, applyTheme } from './theme';
applyTheme(getInitialTheme());

const app = createApp(App);
app.use(router);
app.mount("#app");

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwabuilder-sw.js');
  });
}