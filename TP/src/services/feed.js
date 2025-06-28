import supabase from './supabase';
import { uploadFile, deleteFile, getFileURL } from './storage';

/**
 *  Devuelve todos los posts de la tabla feed
 * 
 * @returns {Promise<Object|null>}
 */
const feedChannel = supabase.channel('public:feed') // crea un canal de suscripción a la tabla feed

export async function fetchFeed() {
    // Supabase client debe estar configurado
    try {
        const { data, error } = await supabase // await es necesario para que funcione correctamente
            .from('feed')
            .select('*')
            .order('created_at', { ascending: false });
        return data;
    } catch (error) {
        console.error('[feed.js fetchFeed] Error al obtener los posteos: ', error);
        throw new Error('No se pudieron obtener los posteos: ' + error);
    }
}

export async function fetchPostsByUserId(id) {
    // Supabase client debe estar configurado
    try {
        const { data, error } = await supabase // await es necesario para que funcione correctamente
            .from('feed')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });
        return data;
    } catch (error) {
        console.error('[feed.js fetchFeed] Error al obtener los posteos: ', error);
        throw new Error('No se pudieron obtener los posteos: ' + error);
    }
}

/**
 * Trae un post por su ID
 *
 * @param {string|number} id 
 * @returns {Promise<Object|null>}
 */

export async function fetchPostById(id) {
    // Supabase client debe estar configurado
    try {
        const { data, error } = await supabase // await es necesario para que funcione correctamente
            .from('feed')
            .select('*')
            .eq('id', id);
        return data[0];

    } catch (error) {
        console.error('[feed.js fetchFeed] Error al obtener los posteos: ', error);
        throw new Error('No se pudieron obtener los posteos: ' + error);
    }
}

/**
 * Se suscribe para recibir los nuevos posteos.
 * 
 * @param {(object) => void} callback 
 */
let isSubscribed = false;

export async function subscribeToFeed(callback) {
    feedChannel.on(
        'postgres_changes',
        {
            schema: 'public',
            table: 'feed',
            event: 'INSERT', // Escuchamos los nuevos posteos que se inserten. En la API "postgres_changes" los eventos están prestablecidos. Pueden ser: * = Todos, INSERT, UPDATE o DELETE
        },
        data => {
            callback(data.new); // La propiedad con los datos del nuevo mensaje es "new".
        },
    );
    if (!isSubscribed) {
        feedChannel.subscribe();
        isSubscribed = true;
    }
}

/**
 *  Guarda un post en la tabla feed
 * 
 * @param {{user_id: uuid, content: string, image: string | null }} data 
 */

export async function saveFeedPost(data) {
    feedChannel.send({
        type: 'broadcast', //tipo de API
        event: 'new-post',
        payload: { ...data, } //payload del evento
    });

    const { error } = await supabase
        .from('feed') // indica la tabla a la que se va a insertar el registro
        .insert({
            ...data
        });

    if (error) {
        console.error('[feed.js saveFeedPost] No se pudo crear el post: ', error);

        throw new Error('No se pudo crear el post:' + error);
    }
}

/**
 *  Guarda un comentario en la tabla feed
 * 
 * @param {{user_id: uuid, content: string}} data 
 */

export async function saveFeedComment(data) {
    console.log(data);
    const { error } = await supabase
        .from('comments') // indica la tabla a la que se va a insertar el registro
        .insert({
            ...data
        });

    if (error) {
        console.error('[feed.js saveFeedComment] No se pudo crear el comentario: ', error);

        throw new Error('No se pudo crear el comentario:' + error);
    }
}


/**
*  Actualiza los datos del posteo por ID
* 
* @param {string} id
* @param {{content string | null, image: string | null}} data
*/
export async function updatePost($id, data) {
    console.log(data);
    const { error } = await supabase
        .from('feed')
        .update({ ...data })
        .eq('id', $id);

    if (error) {
        console.error('Error al actualizar los datos del posteo: ', error);
        throw new Error('No se pudieron actualizar los datos del posteo: ' + error);
    }

    return {
        ...data
    }
}

/**
 * Borra un post de la tabla 'feed' por su ID
 * 
 * @param {string} id - El ID del post a borrar
 * @returns {Promise<void>}
 */
export async function deletePost(id, image) {
    console.log('CL: ', id, image);
    const { imageError } = await supabase
        .storage
        .from('images')
        .remove([image]);
    if (imageError) {
        console.error('Error al borrar la imagen:', imageError);
    }

    const { error } = await supabase
        .from('feed')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al borrar el post:', error);
        throw new Error('No se pudo borrar el post: ' + error);
    }
}


/**
 * recibe un id de un post y devuelve todos los comentarios de ese post
 *              
 * @param {string} postId
 * @return {Promise<import('@supabase/supabase-js').PostgrestResponse<any>>}
 */

export async function fetchPostComments(postId) {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[feed.js getFeedComments] No se pudieron obtener los comentarios: ', error);

        throw new Error('No se pudieron obtener los comentarios:' + error);
    }

    return data;
}