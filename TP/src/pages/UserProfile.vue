<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppH1 from '../components/AppH1.vue';
import FeedList from '../components/FeedList.vue';
import { subscribeToAuth } from '../services/auth';
import { fetchPostsByUserId } from '../services/feed';
import { getUserProfileById } from '../services/users';


const route = useRoute();

const user = ref({
    id: null,
    email: null,
    display_name: '',
    neighbourhood: '',
    bio: '',
});
const posts = ref([]);
const loading = ref(false);

const authUser = ref({
    id: null,
    email: null,
});

function setupAuthUser() { // Subscribe to auth and set authUser
    subscribeToAuth(userData => {
        authUser.value.id = userData?.id || null;
        authUser.value.email = userData?.email || null;
    });
}

async function loadUserProfileAndPosts() { // Get user id from URL and load profile and posts
    loading.value = true;
    console.log('route.params:', route.params); // Debug: log route params
    const userId = route.params.id;
    if (!userId) {
        console.error('No userId in route params:', route.params); // Debug: log missing userId
        loading.value = false;
        return;
    }
    try {
        const profileData = await getUserProfileById(userId);
        user.value = profileData || { id: userId };
    } catch (error) {
        console.error("Error trayendo los datos de perfil:", error);
    }
    try {
        posts.value = await fetchPostsByUserId(userId);
    } catch (error) {
        console.error("Error trayendo los posteos:", error);
    }
    loading.value = false;
}

onMounted(() => {
    setupAuthUser();
    loadUserProfileAndPosts();
});

</script>
<template>
    <AppH1>
        Mi Perfil
    </AppH1>


    <section
        class="flex flex-wrap justify-center align-center m-4 p-12 shadow-md border border-indigo-500 max-w-140 mx-auto">
        <div v-if="!loading">
            <div class="flex flex-col lg:flex-row gap-4">
                <img v-if="user.profile?.avatar" :src="user.profile.avatar" alt="Avatar"
                    class="w-32 h-32 rounded-full object-cover mb-4">
            </div>
            <p class="basis-full mb-4"><span class="font-bold text-indigo-700">Nombre: </span>{{ user.display_name ||
                'usuario anonimo' }} </p>
            <p class="basis-full mb-4"><span class="font-bold text-indigo-700">Email: </span>{{ user.email }} </p>
            <p class="basis-full mb-4"><span class="font-bold text-indigo-700">Barrio: </span>{{ user.neighbourhood ||
                'no especificado' }} </p>
            <p class="basis-full mb-4"><span class="font-bold text-indigo-700">Acerca de mí: </span>{{ user.bio }}</p>
        </div>
        <div v-else>
            <p class="font-bold text-indigo-700"> cargando...</p>
        </div>
        <div v-if="user.id === authUser.id">
            <p class="text-indigo-500 mt-8 w-100 text-center block">¿Querés actualizar tus datos? <router-link
                    to="editar/" class="text-indigo-700 mr-4">Editar Perfil</router-link></p>
        </div>

    </section>


    <section
        class="flex flex-wrap justify-center align-center mx-4 px-4 py-8 shadow-md border border-indigo-500 max-w-140 mx-auto">
        <p class="font-bold text-indigo-700 basis-full">Ofertas publicadas</p>
        <FeedList :posts="posts" :user="user" ref="feedList" @post-submitted="publishComment" />
    </section>

</template>