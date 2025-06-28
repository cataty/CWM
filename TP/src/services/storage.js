import supabase from './supabase';

/**
 * Sube el archivo con
 * 
 * 
 * @param {File} file
 * @param {String} name
 */

export async function uploadFile(file, name, bucket) {
    const { data, error } = await supabase.storage.from(bucket).upload(name, file, {
        cacheControl: '3600',
        upsert: true,
    });

    if (error) {
        console.error('[storage.js uploadFile] No se pudo subir el archivo: ', error);
        throw new Error('No se pudo subir el archivo: ' + error.message);
    }

    console.log('[storage.js uploadFile] Archivo subido correctamente: ', data);

    return data;
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 */
export async function deleteFile(filename, bucket) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .remove([filename]);

    if (error) {
        console.error('[storage.js deleteFile] Error al eliminar el archivo: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} filename 
 * @param {string} bucket 
 * @returns {string} HTML pública del [filename].
 */
export function getFileURL(filename, bucket) {
    const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filename);
    return data.publicUrl;
}