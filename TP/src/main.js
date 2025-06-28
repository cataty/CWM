import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'

const app = createApp(App);

app.use(router);
app.mount('#app');

// grab everything we need
const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

// add event listeners
btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});