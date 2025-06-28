<script setup>
import { ref, watch } from 'vue';
import { getUserProfileById } from '../services/users';
import useAuthUserState from '../composables/useAuthStateUser';


// Props
const props = defineProps({
    user: { type: Object, required: true },
    posts: { type: Array, required: true }
});

const authUser = useAuthUserState();

// State
const postList = ref([]);
const loading = ref(false);
const placeholder = ref('../../public/img/favicon.png')

// Methods
function scrollToBottom() {
    const feedContainer = feedContainerRef.value;
    if (feedContainer) {
        feedContainer.scrollTop = feedContainer.scrollHeight;
    }
}

async function loadPosts(posts) {
    loading.value = true;
    postList.value = posts.map(post => ({ ...post }));
    for (const post of postList.value) {
        try {
            post.profile = await getUserProfileById(post.user_id);
        } catch (error) {
            post.profile = { display_name: null };
        }
        /* try {
            post.comments = await fetchPostComments(post.id);
            for (const comment of post.comments) {
                try {
                    comment.profile = await getUserProfileById(comment.user_id);
                } catch (error) {
                    comment.profile = { display_name: null };
                }
            }
        } catch (error) {
            post.comments = [];
        } */
    }
    loading.value = false;
}

// Refs
const feedContainerRef = ref(null);

// Watch for posts prop changes
watch(
    () => props.posts,
    (newPosts) => {
        loadPosts(newPosts);
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <div v-if="!loading">
        <h2 class="sr-only"> Lista de Posteos </h2>
        <ol class="max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-340px)] overflow-scroll p-4" ref="feedContainerRef">
            <li v-for="post in postList" :key="post.id"
                class="flex flex-col gap-2 mb-4 border border-indigo-300 bg-slate-100 rounded p-4 shadow-md basis-full">
                <p class="text-xs text-indigo-900 flex justify-between">
                    <span class="font-bold">
                        <div clas=""><router-link :to="`/usuarios/${user.id}`" class="text-indigo-700 text-center">{{
                            post.profile?.display_name || ("usuario " + post.user_id) }}</router-link></div>
                    </span>
                    <span>{{ post.created_at ? post.created_at.replace('T', ' ').substring(0, 19) : '' }}</span>
                </p>
                <div class="flex justify-between items-center my-4">
                    <div class="post-image w-24"><img :src="`${post.image ? post.image : placeholder}`" />
                    </div>
                    <p class="p-4 mt-4 bg-white w-100 ml-4">{{ post.content }}</p>
                </div>
                <div>
                    <router-link :to="`/post/${post.id}`" class="text-sm font-bold text-indigo-600">ver
                        comentarios</router-link>
                    <div v-if="authUser.id === post.user_id">
                        <router-link :to="`/post/editar/${post.id}`" class="text-sm font-bold text-indigo-600">
                            editar post
                        </router-link>
                    </div>
                </div>
                <!-- Comments and FeedForm can be added here if needed -->
            </li>
        </ol>
    </div>
    <div v-else class="flex justify-center items-center h-64">
        <p class="font-bold text-indigo-700 mx-auto">cargando...</p>
    </div>
</template>