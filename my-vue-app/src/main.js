import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Creamos la aplicaión con createApp del componente App y la montamos en el div con id app

const app = createApp(App);

app.mount('#app')
