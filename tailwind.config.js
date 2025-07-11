/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          heading: ["'Playfair Display'", "serif"], // para títulos elegantes
          body: ["'Merriweather'", "serif"],       // para texto general legible
          display: ["'Oswald'", "sans-serif"],     // para estilos destacados
        },
        colors: {
          barberGold: "#D4AF37", // color dorado barbería, ya lo tienes
          barberDark: "#1C1C1C",
          barberBrown: "#5C452B",
        },
      },
    },
    plugins: [require('tailwind-scrollbar-hide')],
  };
  