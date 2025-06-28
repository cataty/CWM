// tailwind.config.js
export default {
  content: [
    './index.html',
    "./src/**/*.{html,js,ts,jsx,tsx,vue}"
],
  theme: {
    extend: {
        height:{
            25: "6,25rem",
        },
        gridTemplateRows: {
            'layout': '60px 1fr 100px'
        },
    },
  },
  plugins: [],
}
