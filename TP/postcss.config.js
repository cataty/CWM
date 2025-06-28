// postcss.config.js
import tailwindcss from '@tailwindcss/postcss'; // Import the new plugin
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),  // Initialize the tailwindcss plugin
    autoprefixer(),
  ]
}