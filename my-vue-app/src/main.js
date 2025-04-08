import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js' // Importamos el router

// Creamos la aplicaión con createApp del componente App y la montamos en el div con id app

const app = createApp(App);
app.use(router) // Usamos el router
app.mount('#app')
