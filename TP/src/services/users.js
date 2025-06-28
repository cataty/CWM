import supabase from "./supabase";

/**
 * Agrega un nuevo perfil de usuario a la tabla 'user_data'.
 *
 * @param {Object} data - Los datos del perfil del usuario a insertar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el perfil ha sido creado.
 */
export async function addUserProfile(data) {
    const { error } = await supabase
        .from('user_data')
        .insert({
            ...data
        })


    if (error) {
        console.error('Error al crear el perfil del usuario: ', error);
        throw new Error('No se pudieron crear el perfil del usuario: ' + error);
    }
}

/**
 * Trae datos del perfil de usuario de 'user_data' por ID
 * 
 * @param {string} id
 * @param {{display_name id: string | null, neighbourhood: string | null, bio: string | null}}
 */
export async function getUserProfileById($id) {
    const { data, error } = await supabase
        .from('user_data')
        .select()
        .eq('id', $id);

    if (error) {
        console.error('Error al obtener los datos del usuario: ', error);
        throw new Error('No se pudieron obtener los datos del usuario: ' + error);
    }

    return {
        ...data[0]
    }
}

/**
 * Actualiza los datos del perfil de 'user_data' por ID
 * 
 * @param {string} id
 * @param {{display_name id: string | null, neighbourhood: string | null, bio: string | null}}
 */
export async function updateUserProfile($id, data) {
    console.log(data);
    const { error } = await supabase
        .from('user_data')
        .update({ ...data })
        .eq('id', $id);

    if (error) {
        console.error('Error al actualizar los datos del usuario: ', error);
        throw new Error('No se pudieron actualizar los datos del usuario: ' + error);
    }

    return {
        ...data
    }
}

/**
 *  Devuelve todos los usuarios de la tabla feed
 * 
 * @returns {Promise<Object|null>}
 */
export async function fetchAllUsers() {
    // Supabase client debe estar configurado
    try {
        const { data, error } = await supabase // await es necesario para que funcione correctamente
            .from('user_data')
            .select('*')
        return data;
    } catch (error) {
        console.error('[feed.js fetchFeed] Error al obtener los posteos: ', error);
        throw new Error('No se pudieron obtener los posteos: ' + error);
    }
}