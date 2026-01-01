import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

export default defineConfig({
  site: "https://tohu-sand.com",
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
