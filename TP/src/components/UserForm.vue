<script>
export default {
    name: "UserForm",
    data: function () {
        return {
            user: {
                email: "",
                password: "",
                nickname: "",
            },
            updating: false,
            registerForm: false,
        }
    },
    methods: {
        handleSubmit() {
            this.updating = true;
            const user = {
                email: this.user.email,
                password: this.user.password,
                nickname: this.user.nickname,
            };
            this.$emit('user-submitted', { email: user.email, password: user.password, nickname: user.nickname });

            this.user.email = "";
            this.user.password = "";
            this.user.nickname = "";

            this.updating = false;
        }
    },
    emits: {
        'user-submitted': function (payload) {
            return typeof payload.email === 'string' &&
                payload.email.trim().length > 0 &&
                typeof payload.password === 'string' &&
                payload.password.trim().length > 0;
            payload.nickname = this.registerForm ? payload.nickname : null;
            return true;
        }
    },
    mounted() {
        const url = window.location.toString();
        this.registerForm = url.includes("registro") ? true : false;

    }
}
</script>

<template>
    <form action="#" @submit.prevent="handleSubmit()" class="flex flex-wrap justify-center">
        <template v-if="registerForm">
            <div class="mb-4 basis-full flex justify-center flex-wrap">
                <label for="nickname" class="block mb-2 mx-auto basis-full text-center">nombre</label>
                <input type="text" id="nickname" class="border rounded py-2 px-4 mx-auto"
                    v-model="user.nickname"></input>
            </div>
        </template>
        <div class="mb-4 basis-full flex justify-center flex-wrap">
            <label for="email" class="block mb-2 mx-auto basis-full text-center">email</label>
            <input type="email" id="email" class="border rounded py-2 px-4 mx-auto" v-model="user.email"></input>
        </div>
        <div class="mb-4 basis-full flex justify-center flex-wrap">
            <label for="password" class="block mb-2 mx-auto basis-full text-center">contraseña</label>
            <input type="password" id="password" class="border rounded py-2 px-4 mx-auto"
                v-model="user.password"></input>
        </div>
        <button type="submit" class="py-2 px-4 rounded-full bg-indigo-600 text-white">
            Enviar
        </button>
    </form>

</template>