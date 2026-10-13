import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import { remarkBlueskySnapshot } from "./src/plugins/remark-bluesky-snapshot.mjs";
import { rehypeLazyImages } from "./src/plugins/rehype-lazy-images.mjs";

export default defineConfig({
  site: "https://tohu-sand.com",
  vite: {
    plugins: [tailwindcss()],
  },
  // デフォルトの'jsx'だとインライン要素間の空白が落ちる
  compressHTML: true,
  markdown: {
    // remarkプラグインを使うのでunified
    processor: unified({
      remarkPlugins: [remarkBlueskySnapshot],
      rehypePlugins: [rehypeLazyImages],
    }),
  },
  integrations: [sitemap({
    filter: (page) => !page.endsWith("/contact/thank-you/"),
  }), icon(
    {
      include: {
        "simple-icons": ["twitter", "bluesky"],
      },
    }
  )],
});
