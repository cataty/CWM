<script setup>
import { updateUserProfile, getUserProfileById } from '../services/users'
import { subscribeToAuth } from '../services/auth';
import { uploadFile, getFileURL } from '../services/storage';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import AppH1 from '../components/AppH1.vue';

const router = useRouter();
const userProfileModel = reactive({
    user: {
        id: null,
        email: null,
    },
    profile: {
        display_name: '',
        neighbourhood: '',
        bio: '',
        avatar: ''
    },
    updating: false,
});

const avatarFile = ref(null);
const avatarPreview = ref(null);

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
        avatarPreview.value = URL.createObjectURL(file);
    }
}


async function handleAvatarSubmit(file) {
    const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload(`${file.name}`, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { publicURL, error: urlError } = supabase   // Get the public URL of the uploaded image
        .storage
        .from('avatars')
        .getPublicUrl(`${file.name}`);
    console.log(publicURL);

    if (urlError) {
        console.error('Error getting public URL:', urlError);
        return null;
    }
    userProfileModel.value.profile.avatar = publicURL;
    return publicURL;
}

async function handleProfileSubmit() {
    try {
        userProfileModel.updating = true;
        await updateUserProfile(userProfileModel.user.id, {
            ...userProfileModel.profile
        });
        router.push(`/usuarios/${userProfileModel.user.id}`);
    } catch (error) {
        console.error("Error actualizando los datos del usuario:", error);
    } finally {
        userProfileModel.updating = false;
    }
}

onMounted(() => {
    subscribeToAuth(async userData => {
        if (!userData.id) {
            console.warn('userData.id is missing!');
            return;
        }
        userProfileModel.user.id = userData.id;
        userProfileModel.user.email = userData.email;

        try {
            const profileData = await getUserProfileById(userProfileModel.user.id);
            if (profileData) {
                userProfileModel.profile = profileData;
            }
        } catch (error) {
            console.error("Error trayendo los datos de perfil:", error);
        }
    });
});
</script>

<template>
    <AppH1>
        Editar mis datos
    </AppH1>

    <div
        class="flex flex-wrap justify-center align-center mt-4 p-12 shadow-md border border-indigo-500 max-w-100 mx-auto">

        <!-- Profile Edit Form -->
        <form @submit.prevent="handleProfileSubmit" class="flex flex-wrap justify-center">
            <div class="mb-4 basis-full flex justify-center flex-wrap">
                <label for="name" class="block mb-2 mx-auto basis-full">Nombre</label>
                <input type="text" id="name" class="border rounded py-2 px-4 mx-auto"
                    v-model="userProfileModel.profile.display_name" />
            </div>
            <label for="avatar" class="block mb-2 mx-auto basis-full">Avatar</label>
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar Preview"
                class="mb-4 w-24 h-24 rounded-full object-cover" />
            <input type="file" id="avatar" name="avatar" accept="image/*" @change="handleFileChange" class="mb-4">

            <div class="mb-4 basis-full flex justify-center flex-wrap">
                <label for="email" class="block mb-2 mx-auto basis-full">Email</label>
                <input type="email" id="email" class="border rounded py-2 px-4 mx-auto"
                    v-model="userProfileModel.user.email" />
            </div>
            <div class="mb-4 basis-full flex justify-center flex-wrap">
                <label for="neighbourhood" class="block mb-2 mx-auto basis-full">Barrio</label>
                <input type="text" id="neighbourhood" class="border rounded py-2 px-4 mx-auto"
                    v-model="userProfileModel.profile.neighbourhood" />
            </div>
            <div class="mb-4 basis-full flex justify-center flex-wrap">
                <label for="bio" class="block mb-2 mx-auto basis-full">Acerca de mí</label>
                <input type="textarea" id="bio" class="border rounded py-2 px-4 mx-auto"
                    v-model="userProfileModel.profile.bio" />
            </div>
            <button type="submit" class="rounded-full py-2 px-4 bg-indigo-500 text-white">
                Actualizar
            </button>
        </form>
    </div>

</template>