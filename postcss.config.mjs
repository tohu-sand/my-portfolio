// @astrojs/tailwind は Astro 6 以降に非対応のため、同等の PostCSS 構成を直接指定する
export default {
  plugins: {
    tailwindcss: { config: "./tailwind.config.mjs" },
    autoprefixer: {},
  },
};
