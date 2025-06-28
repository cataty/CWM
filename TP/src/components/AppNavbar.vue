<script setup>
import { subscribeToAuth, logout } from '../services/auth';
import { getUserProfileById } from '../services/users';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({
    id: null,
    email: null
});
const isMobileMenuOpen = ref(false);

function handleLogout() {
    logout();
    user.value.id = null;
    user.value.email = null;
    router.push('/login');
}

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

onMounted(() => {
    subscribeToAuth(async userData => {
        if (!userData.id) {
            user.value = {
                id: null,
                email: null
            };
            console.warn('userData.id is missing!');
            return;
        }

        user.value.id = userData.id;
        user.value.email = userData.email;

        try {
            const profileData = await getUserProfileById(user.value.id);
            if (profileData) {
                Object.assign(user.value, profileData); console.log("Datos de perfil del usuario:", user.value);
            } else {
                console.warn("No se encontraron datos de perfil para el usuario.");
            }

        } catch (error) {
            console.error("Error trayendo los datos de perfil:", error);
        }
    });
});
</script>

<template>

    <!-- navbar goes here -->
    <nav class="bg-indigo-700 h-16">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between">


                <div class="flex space-x-4 h-16">
                    <!-- 
        <div>
          <a href="#" class="flex items-center py-5 px-2 rounded-full">
            <img src="../../public/img/favicon.svg" alt="">
            <span class="font-bold">Mundofertas</span>
          </a>
        </div> -->

                    <div class="hidden md:flex items-center space-x-1">
                        <ul class="navbar-list">
                            <li><router-link to="/" class="text-white px-4">Home</router-link></li>
                            <template v-if="user.id === null">
                                <li>
                                    <router-link to="/login" class="text-white px-4">Iniciar sesión</router-link>
                                </li>
                                <li>
                                    <router-link to="/registro" class="text-white px-4">Registrarse</router-link>
                                </li>
                            </template>
                            <template v-else>
                                <li>
                                    <router-link to="/feed" class="text-white px-4">Feed de ofertas</router-link>
                                </li>
                                <li>
                                    <router-link to="/usuarios" class="text-white px-4">Usuarios</router-link>
                                </li>
                                <li>
                                    <router-link :to="`/usuarios/${user.id}`" class="text-white px-4">Mi
                                        perfil</router-link>
                                </li>
                                <li>
                                    <form action="#" @submit.prevent="handleLogout">
                                        <button type="submit" class="text-white px-4">{{ user.display_name ?
                                            user.display_name : user.email }} (Cerrar sesión)</button>
                                    </form>
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>

                <div class="md:hidden flex items-center">
                    <button class="mobile-menu-button">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>

        <div :class="['mobile-menu md:hidden bg-indigo-700', isMobileMenuOpen ? 'block' : 'hidden']">
            <ul class="navbar-list">
                <li><router-link to="/" class="text-white px-4">Home</router-link></li>
                <template v-if="user && user.id === null">
                    <li>
                        <router-link to="/login" class="text-white px-4">Iniciar sesión</router-link>
                    </li>
                    <li>
                        <router-link to="/registro" class="text-white px-4">Registrarse</router-link>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <router-link to="/feed" class="text-white px-4">Feed de ofertas</router-link>
                    </li>
                    <li>
                        <router-link :to="`/usuarios/${user.id}`" class="text-white px-4">Mi perfil</router-link>
                    </li>
                    <li>
                        <form action="#" @submit.prevent="handleLogout">
                            <button type="submit" class="text-white px-4">{{ user.display_name ? user.display_name :
                                user.email }} (Cerrar sesión)</button>
                        </form>
                    </li>
                </template>
            </ul>
        </div>
    </nav>

</template>