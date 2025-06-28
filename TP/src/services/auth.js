import supabase from "./supabase";
import { addUserProfile, getUserProfileById } from "./users";
import { uploadFile } from "./storage";

let user = {
    id: null,
    email: null,
};

let observers = [];


/**
 * Carga el perfil del usuario actual y lo agrega al estado global del usuario mediante updateUser.
 *
 * @returns {Promise<void>} Una promesa que se resuelve cuando el perfil ha sido cargado y actualizado.
 */
loadCurrentUser(); // Invoca la carga del usuario actual inmediatamente.

async function loadCurrentUser() {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;

    updateUser({
        id: data.user.id,
        email: data.user.email,
    });

    loadCurrentUserProfile();
}

async function loadCurrentUserProfile() { //carga los datos del perfil y los agrega al usuario mediante updateUser
    try {
        const profile = await getUserProfileById(user.id);
        updateUser({
            ...profile,
        })
    } catch (error) {
        console.error('[auth.js register] No se pudo cargar el perfil del usuario: ', error);

        throw new Error('No se pudo cargar el perfil del usuario:' + error + email + password);
    }

}

/**
 * 
 * @param {{id: string|null, email: string|null}} data 
 */

function updateUser(data) {
    user = {
        ...user,
        ...data,
    };
    notifyAll();
}

/**
 * 
 * @param {File} file 
 */
export async function updateAvatar(file) {
    try {
        const currentAvatar = user.profile.avatar;
        console.log(currentAvatar);
        const name = `${user.id}/${crypto.randomUUID()}.${getFileExtension(file)}`; //generar un nombre único para la foto
        await uploadFile(name, file);
        // Obtenemos la URL pública del archivo y la guardamos en el perfil del usuario.
        await updateAuthProfile({
            avatar: getFileURL(name),
        });

        // Borramos la imagen anterior, si es que existe.
        if (currentAvatar) {
            // Removemos la parte de la URL absoluta del archivo para quedarnos con solo la parte que figura después
            // de la carpeta "avatars/".
            const filenameToDelete = currentAvatar.slice(currentAvatar.indexOf('avatars/') + 8);
            await deleteFile(filenameToDelete);
        }
    } catch (error) {
        console.error('[auth.js updateAuthAvatar] Error al actualizar la imagen de perfil del usuario autenticado: ', error);
        throw error;
    }
}


/**
 * 
 * @param {{id: string|null, email: string|null}} data 
 */

export function getUrl(file, bucket = "avatars") {
    const { data, error } = supabase.storage.from(bucket).getPublicUrl(file);
    if (error) {
        console.error('[auth.js getFileUrl] No se pudo obtener la URL del archivo: ', error);
        throw new Error('No se pudo obtener la URL del archivo: ' + error.message);
    }
    return data;
}

/**
 * Registra un usuario nuevo
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
export async function register(email, password, nickname) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('[auth.js register] No se pudo registrar el usuario: ', error);

        throw new Error('No se pudo registrar el usuario:' + error + email + password);
    }

    try {
        await addUserProfile({
            email: data.user.email,
            id: data.user.id,
            display_name: nickname
        })
    } catch (error) {
        console.error('[auth.js register] No se pudo crear el perfil del usuario: ', error);

        throw new Error('No se pudo crear el perfil del usuario:' + error + email + password);
    }

    updateUser({
        email: data.user.email,
        id: data.user.id
    })

    console.log('[auth.js register] Usuario registrado: ', user);

    return data.user;

}

/**
 * Autentica al usuario.
 *
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} El usuario autenticado
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('[auth.js login] No se pudo iniciar sesion: ', error);

        throw new Error('No se pudo iniciar sesion:' + error);
    }

    updateUser({
        email: data.user.email,
        id: data.user.id
    })

    loadCurrentUserProfile();

    console.log(data.user);

    return data.user;
}



/**
 * Termina la sesión del usuario.
 *
 * @returns {Promise<void>} Una promesa que se resuelve cuando la sesión ha terminado.
 */

export async function logout() {
    supabase.auth.signOut();

    updateUser({
        email: null,
        id: null
    })
}

// Observers
/**
 * 
 * @param {*} callback 
 */
export async function subscribeToAuth(callback) {
    console.log('notifyObservers llamado con user:', user);
    observers.push(callback);
    notifyObservers(callback);
}


/**
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */

function notifyObservers(callback) {
    callback({ ...user })
}

function notifyAll() {
    observers.forEach(callback => notifyObservers(callback));
}