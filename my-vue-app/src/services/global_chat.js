import supabase from "./supabase";

export async function saveGlobalChatMessage(data) {
    const {error} = await supabase

        .from("global_chat") // el metodo from permite interactuar con una tabla de la base de datos
        .insert({ // el metodo insert permite insertar un registro en la tabla
            ...data, // el operador spread permite agregar todos los atributos del objeto data
        }); 
        
    if (error) {
        console.error("Error saving chat message:", error);
    }
}