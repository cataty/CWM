import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').UserConfig} */

export default defineConfig({
  css: {
    postcss: './postcss.config.js',  
  },
    plugins: [vue(),tailwindcss()]
})

