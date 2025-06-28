import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuth } from "../services/auth";

export default function useAuthUserState() {
    // Definimos una variable para poder guardar la función para cancelar la suscripción de la autenticación.
    let unsubscribeAuth = null;

    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });

    onMounted(() => {
        unsubscribeAuth = subscribeToAuth(newUserData => user.value = newUserData);
    });
    onUnmounted(() => {
        if (typeof unsubscribeAuth === 'function') {
            unsubscribeAuth();
        }
    });

    return user;
}