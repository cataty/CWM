<script>
import { register } from '../services/auth.js'
import AppH1 from '../components/AppH1.vue';
import UserForm from '../components/UserForm.vue';

export default {
    name: 'Register',
    components: {
        AppH1,
        UserForm
    },
    methods: {
        async register(user) {
            try {
                console.log("user ", user);
                await register(user.email, user.password, user.nickname)
                this.$router.push('/');
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
            }
        },
    }
}
</script>

<template>
    <AppH1>
        Registro de Usuario
    </AppH1>
    <div
        class="flex flex-wrap justify-center align-center mt-4 p-12 shadow-md border border-indigo-500 max-w-100 mx-auto mb-12">
        <div class="flex justify-center basis-full">
            <UserForm @user-submitted="register" />
        </div>
        <div class="flex justify-center basis-full">
            <p class="text-indigo-500 mt-8">¿Ya tenés cuenta? <router-link to="/login" class="text-indigo-700">Iniciar
                    Sesión</router-link></p>
        </div>
    </div>
</template>
