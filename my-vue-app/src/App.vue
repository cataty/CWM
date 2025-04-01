<script>
import Home from './pages/Home.vue'
//Si usamos al option API, necesitamos exportar un objeto con un componente
//Si usamos el Composition API, necesitamos exportar un objeto con un setup

//Si queremos usar componentes con la options API, debemos declararlas en el objeto components
//Si queremos usar componentes con la Composition API, debemos declararlas en el objeto setup
export default {
  name: 'App',
  components: {
    Home
  }

}
</script>

<template>
<h1>Hola Mundo desde Vue</h1>
<nav>
  <router-link to="/">Home</router-link>
  <router-link to="/login">Login</router-link>
  <router-link to="/register">Register</router-link>  
  <router-link to="/globalchat">Chat</router-link>
</nav>
<router-view />
</template>

<style scoped>
/*el estilo scoped solo afecta a este componente*/

</style>
