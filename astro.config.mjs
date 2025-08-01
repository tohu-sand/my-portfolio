import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

export default defineConfig({
  integrations: [tailwind({
    config: "./tailwind.config.mjs",
  }), sitemap(), icon(
    {
      include: {
        "simple-icons": ["twitter", "bluesky"],
      },
    }
  )],
  content: {
    collections: {
      info: {
        type: "content",
        schema: ({ z }) =>
          z.object({
            title: z.string(),
            date: z.date(),
            category: z.string().optional(),
            location: z.string().optional(),
            url: z.string().url().optional(),
            description: z.string().optional(),
          }),
      },
      gallery: {
        type: "content",
        schema: ({ z }) => 
          z.object({
            title: z.string(),
            date: z.date(),
            tags: z.array(z.string()).optional(),
            thumbnail: z.string(),
            image: z.string().optional(),
            description: z.string().optional(),
          }),
      },
      posts: {
        type: "content",
        schema: ({ z }) =>
          z.object({
            title: z.string(),
            date: z.date(),
            tags: z.array(z.string()).optional(),
            thumbnail: z.string(),
            excerpt: z.string().optional(),
          }),
      },
    },
  },
});