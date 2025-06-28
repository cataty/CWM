<script setup>
import { ref, onMounted } from 'vue';
import AppH1 from '../components/AppH1.vue';
// Import your user fetching service
import { fetchAllUsers } from '../services/users';
import { RouterLink } from 'vue-router';

const users = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        users.value = await fetchAllUsers();
    } catch (error) {
        console.error('Error trayendo usuarios:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <AppH1>Lista de usuarios</AppH1>
    <div v-if="loading" class="flex justify-center items-center h-64">
        <p class="font-bold text-indigo-700 mx-auto">cargando...</p>
    </div>
    <section v-else class="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto content-around justify-start">
        <ul class="max-w-400 mx-auto">
            <li v-for="user in users" :key="user.id" class="mb-2 p-4 border rounded flex">
                <div><img :src="user.avatar"></div>
                <div>
                    <div><strong>
                            <router-link :to="`/usuarios/${user.id}`" class="text-indigo-700">{{ user.display_name ||
                                user.email }}</router-link></strong></div>
                    <div class="text-sm text-gray-600">{{ user.email }}</div>
                    <div class="text-sm text-gray-600">{{ user.neighbourhood }}</div>
                    <div clas=""><router-link :to="`/usuarios/${user.id}`" class="text-indigo-700 text-center">ver
                            perfil</router-link></div>
                </div>
            </li>
        </ul>
    </section>

</template>