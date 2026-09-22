import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    image: z.string().optional(),
    mediumImage: z.string().optional(),
    // mediumImage の実寸（px）。作品ページの <img> に width/height として出し、読み込み中のレイアウトずれを防ぐ
    mediumWidth: z.number().int().positive().optional(),
    mediumHeight: z.number().int().positive().optional(),
    thumbnail: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    kind: z.enum(['illustration', 'comic']).optional(),
    reader: z
      .object({
        src: z.string(),
        title: z.string().optional(),
      })
      .optional(),
  }).superRefine((data, ctx) => {
    const kind = data.kind ?? 'illustration';
    if (kind === 'comic') {
      if (!data.reader?.src) {
        ctx.addIssue({
          code: 'custom',
          message: 'reader.src is required for comics',
          path: ['reader', 'src'],
        });
      }
    } else if (!data.image) {
      ctx.addIssue({
        code: 'custom',
        message: 'image is required for illustrations',
        path: ['image'],
      });
    }
    if ((data.mediumWidth === undefined) !== (data.mediumHeight === undefined)) {
      ctx.addIssue({
        code: 'custom',
        message: 'mediumWidth and mediumHeight must be set together',
        path: ['mediumWidth'],
      });
    }
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    thumbnail: z.string(),
    // thumbnail の実寸（px）。記事ページの見出し画像に width/height として出す
    thumbnailWidth: z.number().int().positive().optional(),
    thumbnailHeight: z.number().int().positive().optional(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
  }).refine((data) => (data.thumbnailWidth === undefined) === (data.thumbnailHeight === undefined), {
    message: 'thumbnailWidth and thumbnailHeight must be set together',
    path: ['thumbnailWidth'],
  }),
});

// `drafts/` 配下も読み込む（本番ビルドでの除外は src/utils/info.ts の isPublishedInfo が行う）
const info = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/info' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    location: z.string().optional(),
    url: z.url().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  gallery,
  posts,
  info,
};
