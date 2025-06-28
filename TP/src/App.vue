<script setup>
import supabase from './services/supabase';
import { ref, onMounted } from 'vue';
import Home from './pages/Home.vue';
import AppFooter from './components/AppFooter.vue';
import AppNavbar from './components/AppNavbar.vue';
import NotificationBox from './components/NotificationBox.vue';
import { subscribeToAuth, logout } from './services/auth';
import { useRoute, useRouter } from 'vue-router';

const user = ref({
    id: null,
    email: null,
});

const route = useRoute();
const router = useRouter();

console.log(route.state);

function handleLogout() {
    logout();
    router.push('/login');
}

onMounted(() => {
    subscribeToAuth(userData => {
        user.value = userData;
        console.log("user", user.value);
    });
});
</script>

<template>
    <AppNavbar :id="user.id" :email="user.email" ref="navbar" @user-logged-out="handleLogout" />
    <main class="w-full my-12 lg:min-h-[calc(100vh-260px)] overflow-scroll mx-auto">
        <!--router-view @user-logged-in="handleLogin" /> // escucha el evento emitido por el componente Login -->
        <router-view />
    </main>
    <AppFooter />
</template>