<script>
    import MainH1 from '../../../dv-cwm-2025-1-tarde/src/components/MainH1.vue';
import exampleMessages from '../data/messages.json'; // Importamos el archivo JSON con los mensajes de ejemplo
    import { saveGlobalChatMessage } from '../services/global_chat'; // Importamos la función para guardar mensajes en la base de datos
    export default {
        name: 'GlobalChat',
        components: {
            MainH1,
        },
        data() {
            return {
                messages: exampleMessages,
                newMessage: {
                    email: '',
                    texto: ''
                },
            };
        },
        methods: {
            sendMessage() { // Metodo para guardar el mensaje en Vue
                const newMessage = {
                    email: this.newMessage.email,
                    texto: this.newMessage.texto,
                    fecha: new Date().toLocaleString() // Obtener la fecha y hora actual
                };
                this.messages.push(newMessage); // Agregar el nuevo mensaje a la lista de mensajes
                this.newMessage.email = ''; // Limpiar el campo de email
                this.newMessage.texto = ''; // Limpiar el campo de texto
            },
            async sendMessageToDB() { // Método para enviar el mensaje a la base de datos
                try {
                    await saveGlobalChatMessage(...this.newMessage); // Desestructuramos el objeto newMessage para enviar los valores como parámetros
                    this.newMessage.texto = ''; 
                }
                catch (error) {
                    console.error('Error al enviar el mensaje a la base de datos:', error);
                }
                
            }   
        }
    };
</script>

<template>
    <MainH1>
        Chat Global
    </MainH1>

    <div class="flex gap-4 my-3">
        <div class="border border-gray-300 rounded-lg p-4 w-3/4 min-h-100">
            <h2 class="sr-only"> <!-- This is a heading for screen readers only -->
                Lista de Mensajes
            </h2>
            <div class="mb-4">
                <ul>
                    <li 
                    v-for="message in messages"
                    class = "flex flex-col gap-2">
                        <div>{{message.email}}</div>
                        <div>{{message.fecha}}</div>
                        <div>{{message.texto}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-3/12 p-4">
            <h2 class="mb-4 text-2xl">
                Enviar mensaje
            </h2>
            <form
            action=""
            @submit.prevent = "() => sendMessageToDB()"> <!--Prevenir el comportamiento por defecto del formulario--> 
                <div class="mb-3">
                    <label for="email" class="form-label inline-block mb-2 text-gray-700">Email</label>
                    <input 
                    v-model="newMessage.email"
                    type="email" 
                    class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700"  
                    id="email">
                    <label for="texto" class="form-label inline-block mb-2 text-gray-700">Mensaje</label>
                    <textarea 
                    v-model="newMessage.texto"
                    class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                    id="texto" 
                    rows="3">
                    </textarea>
                    <button type="submit" class="transition-colors px-4 py-2 my-2 rounded bg-amber-600 text-amber-50 hover:bg-amber-900 focus:bg-amber-900">enviar</button>
                </div>
            </form>
        </div>
    </div>
</template>