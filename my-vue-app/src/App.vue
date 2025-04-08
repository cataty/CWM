<script>
import MainH1 from './components/MainH1.vue';
import Home from './pages/Home.vue'
//Si usamos al option API, necesitamos exportar un objeto con un componente
//Si usamos el Composition API, necesitamos exportar un objeto con un setup

//Si queremos usar componentes con la options API, debemos declararlas en el objeto components
//Si queremos usar componentes con la Composition API, debemos declararlas en el objeto setup
export default {
  name: 'App',
  components: {
    Home,
    MainH1
  }

}
</script>

<template>
<nav class = "flex gap-4 p-4 bg-gray-800 text-white">
  <a class="text-2xl" href="#">DV Social</a>
  <div id="navbar">
    <ul class="flex gap-4">
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/login">Login</router-link>
      </li>
      <li>
        <router-link to="/register">Register</router-link>  
      </li>
      <li>
        <router-link to="/globalchat">Chat</router-link>
      </li>   
    </ul>
  </div>
</nav>
<div class="container mx-auto">
  <MainH1>Bienvenido a DV Social</MainH1>
  <router-view />
</div>
<footer class="footer flex justify-center align-center bg-gray-300 p-4">
  <p>da Vinci &copy; 2025</p>
</footer>
</template>

<style scoped>
/*el estilo scoped solo afecta a este componente*/

</style>
