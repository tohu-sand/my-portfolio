import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import { remarkBlueskySnapshot } from "./src/plugins/remark-bluesky-snapshot.mjs";

export default defineConfig({
  site: "https://tohu-sand.com",
  // Astro 7 のデフォルト('jsx')は inline 要素間の空白を落とすため、従来どおりの挙動を維持する
  compressHTML: true,
  markdown: {
    // Astro 7 の既定は Sätteri。remark プラグインを使うため unified パイプラインを明示する
    processor: unified({
      remarkPlugins: [remarkBlueskySnapshot],
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
