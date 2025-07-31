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
  // Content Collections を有効化
  content: {
    collections: {
      info: {
        type: "content",
        schema: ({ z }) =>
          z.object({
            title: z.string(),
            date: z.date(),
            category: z.string().optional(),   // 例: Event / Press / Publication
            location: z.string().optional(),   // 会場・出版社など
            url: z.string().url().optional(),  // 関連リンク
            description: z.string().optional(),
          }),
      },
      gallery: {
        type: "content",
        schema: ({ z }) => z.object({
          title: z.string(),
          date: z.date(),
          tags: z.array(z.string()).optional(),
          thumbnail: z.string(),
          description: z.string().optional(),
        }),
      },
      /* ▼ 新規: ブログ記事 */
      posts: {
        type: "content",
        schema: ({ z }) =>
          z.object({
            title: z.string(),
            date: z.date(),
            thumbnail: z.string(),          // /public/assets/〜
            tags: z.array(z.string()).optional(),
            excerpt: z.string().optional(), // 一覧・OGP 用
          }),
      },
    },
  },
});