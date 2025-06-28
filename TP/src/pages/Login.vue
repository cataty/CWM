<script>
import { login } from '../services/auth.js';
import AppH1 from '../components/AppH1.vue';
import UserForm from '../components/UserForm.vue';

export default {
    name: 'Login',
    components: {
        AppH1,
        UserForm
    },
    data: function () {
        return {
            loginError: false,
        }
    },
    methods: {
        async login(user) {
            try {
                const loggedInUser = await login(user.email, user.password);
                this.$emit('user-logged-in', { email: loggedInUser.email, id: loggedInUser.id });   // emite el evento con el usuario logueado para consumir en el componente padre. this.emit('string', {dato: dato})
                this.$router.push('/feed');
            } catch (error) {
                console.error('Error al iniciar la sesión del usuario:', error);
                this.loginError = true;
            }
        },
    }
}
</script>

<template>
    <AppH1>
        Iniciar Sesión
    </AppH1>

    <div
        class="flex flex-wrap justify-center align-center mt-4 p-12 shadow-md border border-indigo-500 max-w-100 mx-auto mb-12">
        <p v-if="loginError" class="text-red-700 block basis-full mb-4"> Datos de usuario incorrectos. Por favor,
            intentá de nuevo </p>
        <div class="flex justify-center basis-full">
            <UserForm @user-submitted="login" ref="loginForm" />
        </div>
        <div class="flex justify-center basis-full">

            <p class="text-indigo-500 mt-8">¿No tenés cuenta? <router-link to="/registro"
                    class="text-indigo-700">Registrarse</router-link></p>
        </div>

    </div>
</template>