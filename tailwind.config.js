/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff4f2",
          100: "#ffe4dc",
          200: "#ffc5b3",
          300: "#ffa08a",
          400: "#ff7a5c",
          500: "#ff5b32",
          600: "#e3461f",
          700: "#b93517",
          800: "#8f2712",
          900: "#64190b"
        }
      },
    },
  },
  plugins: [],
};
