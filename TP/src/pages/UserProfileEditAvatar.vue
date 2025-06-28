<script setup>
import { onUnmounted, ref } from 'vue';
import { updateAvatar } from '../services/auth';
import AppH1 from '../components/AppH1.vue';

// State
const data = ref({
    file: null,
    objectURL: null,
});
const updating = ref(false);

// Handlers
async function handleSubmit(event) {
    event.preventDefault();
    if (!data.value.file) {
        alert("Selecciona un archivo de avatar.");
        return;
    }
    try {
        updating.value = true;
        await updateAvatar(data.value.file);
        alert("Avatar subido ");
    } catch (error) {
        console.error("Error subiendo el avatar:", error);
    } finally {
        updating.value = false;
    }
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (data.value.objectURL) {
            URL.revokeObjectURL(data.value.objectURL); // borrar URL de la imágen anterior para liberar memoria
        }
        data.value.file = file;
        data.value.objectURL = URL.createObjectURL(file);
    } else {
        data.value.file = null;
        data.value.objectURL = null;
    }
}

onUnmounted(() => {
    if (data.value.objectURL) {
        URL.revokeObjectURL(data.value.objectURL);
    }
});
</script>

<template>
    <AppH1>Editar Avatar</AppH1>
    <form @submit="handleSubmit" class="flex flex-col items-center">
        <label for="avatar" class="mb-2 text-lg font-semibold">Subir Avatar</label>
        <input type="file" id="avatar" name="avatar" accept="image/*" @change="handleFileChange" class="mb-4">
        <img v-if="data.objectURL" :src="data.objectURL" alt="Vista previa del avatar" class="mb-4 w-24 h-24 rounded-full object-cover" />
        <button :disabled="updating" type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <span v-if="updating">Subiendo...</span>
            <span v-else>Subir Avatar</span>
        </button>
    </form>
</template>