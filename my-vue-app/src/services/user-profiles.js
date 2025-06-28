import supabase from "./supabase";

export async function addUserProfile(data) {
    const { error } = await supabase
        .from("user_profiles")
        .insert({
            ...data,
        });

    if (error) {
        console.error("Error al crear el perfil de usuario:", error);
        throw new Error("Error al crear el perfil de usuario", error);
    }
}

export async function getUserProfileById(userId) {
    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId) //eq es un metodo que permite filtrar los resultados de la consulta, signfica "equals"
        .single(); // Use single() to get a single object instead of an array
    if (error) {
        console.error("Error al leer perfil de usuario:", error);
    }

    return data;
}