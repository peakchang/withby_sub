import daisyui from "daisyui"
/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: 'class', // ← 이 부분이 중요!
  theme: {
    extend: {},
  },

  plugins: [daisyui],
};

module.exports = config;
