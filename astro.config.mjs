import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import { remarkBlueskySnapshot } from "./src/plugins/remark-bluesky-snapshot.mjs";

export default defineConfig({
  site: "https://tohu-sand.com",
  markdown: {
    remarkPlugins: [remarkBlueskySnapshot],
  },
  integrations: [tailwind({
    config: "./tailwind.config.mjs",
  }), sitemap({
    filter: (page) => !page.endsWith("/contact/thank-you/"),
  }), icon(
    {
      include: {
        "simple-icons": ["twitter", "bluesky"],
      },
    }
  )],
});
