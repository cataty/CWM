<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPostById, updatePost, deletePost } from '../services/feed';
import { uploadFile, getFileURL, deleteFile } from '../services/storage';
import { subscribeToAuth } from '../services/auth';
import AppH1 from '../components/AppH1.vue';

// You need to implement this function for your storage provider
// import { uploadImage } from '../services/storage';

const route = useRoute();
const router = useRouter();

const postModel = reactive({
    id: '',
    user_id: '',
    content: '',
    image: '',
    date: '',
});
const imageFile = ref(null);
const imagePreview = ref(null);
const loading = ref(true);
const isAuthor = ref(false);
const currentUserId = ref(null);

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
}

async function handleFileUpload() {
    deleteFile(postModel.image, "images");
    const fileName = `posts/${Date.now()}_${imageFile.value.name}`;

    uploadFile(imageFile.value, fileName, "images");
    const publicURL = getFileURL(fileName, "images");

    postModel.image = publicURL;
}

async function handlePostSubmit(event) {
    event.preventDefault();
    loading.value = true;
    if (!postModel.content.trim()) {
        alert("El contenido del post no puede estar vacío.");
        loading.value = false;
        return;
    }
    await handleFileUpload();
    try {
        await updatePost(postModel.id, {
            content: postModel.content,
            image: postModel.image,
        });
        router.push({
            path: '/feed',
            query: { message: 'La oferta se editó éxitosamente' } // mensaje de éxito
        });
    } catch (error) {
        console.error("Error actualizando el post:", error);
    } finally {
        loading.value = false;
    }
}

function handleDelete() {
    deletePost(postModel.id, postModel.image);
    router.push({
        path: '/feed',
        query: { message: 'La oferta se borró éxitosamente' } // mensaje de éxito
    });
}

onMounted(async () => {
    console.log('PostEdit.vue mounted');
    // Subscribe to auth changes to keep currentUserId up to date
    subscribeToAuth(userData => {
        currentUserId.value = userData?.id || null;
        console.log('Auth userData:', userData);
        // Update isAuthor if postModel.user_id is already set
        isAuthor.value = postModel.user_id === currentUserId.value;
    });

    // Fetch post immediately on mount
    const postId = route.params.id;
    console.log('Route params:', route.params);
    if (!postId) {
        alert('No se encontró el ID del post.');
        router.push('feed');
        return;
    }
    try {
        const postData = await fetchPostById(postId);
        console.log('Fetched postData:', postData);
        if (!postData) {
            alert('No se encontró el post.');
            router.push('feed');
            return;
        }
        Object.assign(postModel, postData);
        // Set isAuthor if currentUserId is already set
        isAuthor.value = postData.user_id === currentUserId.value;
    } catch (error) {
        console.error("Error trayendo los datos del post:", error);
    } finally {
        loading.value = false;
        console.log('Loading set to false');
    }
});
</script>

<template>
    <AppH1>Editar Post</AppH1>
    <div v-if="loading" class="text-center p-8">Cargando...</div>
    <div v-else>
        <div v-if="isAuthor"
            class="flex flex-wrap justify-center align-center mt-4 p-12 shadow-md border border-indigo-500 max-w-100 mx-auto">
            <!-- Combined Edit Form -->
            <form @submit.prevent="handlePostSubmit" class="flex flex-col items-center w-full">
                <label for="image" class="mb-2 text-lg font-semibold">Imagen</label>
                <input type="file" id="image" name="image" accept="image/*" @change="handleFileChange" class="mb-4">
                <img v-if="imagePreview || postModel.image" :src="imagePreview || postModel.image" alt="Vista previa"
                    class="mb-4 w-24 h-24 rounded object-cover" />

                <div class="mb-4 w-full">
                    <label for="content" class="block mb-2 text-center">Contenido</label>
                    <textarea id="content" class="border rounded py-2 px-4 w-full" v-model="postModel.content"
                        rows="5"></textarea>
                </div>
                <button type="submit" class="rounded-full py-2 px-4 bg-indigo-500 text-white mb-2">
                    Actualizar
                </button>
                <button type="button" @click="handleDelete"
                    class="rounded-full py-2 px-4 bg-indigo-500 text-white mb-2">
                    Borrar Oferta
                </button>
                <!-- Add a delete button here if needed -->
            </form>
        </div>
        <div v-else class="text-center text-red-600 font-bold p-8">
            No tienes permiso para editar este post.
        </div>
    </div>
</template>