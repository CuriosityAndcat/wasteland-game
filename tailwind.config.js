/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        gray: {
          750: '#2d2d3d',
          850: '#17171f',
        },
      },
    },
  },
  plugins: [],
};
