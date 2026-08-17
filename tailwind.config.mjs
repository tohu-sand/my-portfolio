/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,md,mdx,jsx,tsx}",
    "./src/plugins/**/*.mjs",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["Noto Sans JP Variable", "Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
