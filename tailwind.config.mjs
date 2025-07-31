/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,md,mdx,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
