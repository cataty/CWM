<template>
    <MainH1>
        Chat Global
    </MainH1>

    <div class="flex gap-4">
        <div class="border border-gray-300 rounded-lg p-4 w-3/4 min-h-100">
            <h2 class="sr-only"> <!-- This is a heading for screen readers only -->
                Lista de Mensajes
            </h2>
        </div>
        <div class="col-3/12 p-4">
            <h2 class="mb-4 text-2xl">
                Enviar mensaje
            </h2>
            <form action="">
                <div class="mb-3">
                    <label for="email" class="form-label inline-block mb-2 text-gray-700">Email</label>
                    <input type="email" class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700"  id="email">
                    <label for="message" class="form-label inline-block mb-2 text-gray-700">Mensaje</label>
                    <textarea class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="message" rows="3"></textarea>
                    <button type="submit" class="transition-colors px-4 py-2 rounded bg-amber-600 text-amber-50 hover:bg-amber-900 focus:bg-amber-900">enviar</button>
                </div>
            </form>
        </div>
    </div>
</template>