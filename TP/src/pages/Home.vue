<script setup>
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuth } from '../services/auth';
import { onMounted, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
</script>

<template>
	<div class="h-full bg-indigo-50 flex items-center">
		<section
			class="w-full min-h-[calc(100vh-150px)] mb-[-4rem] bg-cover bg-center py-32 bg-cover jumbotron flex flex-col align-center justify-center">
			<div class="container mx-auto text-center">
				<AppH1>
					Bienvenido a Mundofertas
				</AppH1>
				<p class="m-12 lg:m-24 p-12 bg-indigo-100 text-ml text-slate-900">Mundofertas es una red social pensada
					para los habitantes de un barrio, donde pueden compartir y descubrir ofertas que encuentran en los
					supermercados locales. A través de la plataforma, los vecinos publican promociones, descuentos y
					oportunidades especiales que ven durante sus compras diarias, ayudando así a que toda la comunidad
					aproveche los mejores precios.</p>
				<router-link to="login/"
					class="bg-indigo-400 text-white py-4 px-6 lg:px-12 rounded-full hover:bg-indigo-600 mx-2 lg:mx-8">Iniciar
					Sesión</router-link>
				<router-link to="registro/"
					class="bg-indigo-500 text-white py-4 px-6 lg:px-12 rounded-full hover:bg-indigo-600 mx-2 lg:mx-8">Crear
					Cuenta</router-link>

			</div>
		</section>
	</div>

</template>