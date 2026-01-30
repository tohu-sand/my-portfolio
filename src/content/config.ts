import { defineCollection, z } from 'astro:content';

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    image: z.string().optional(),
    mediumImage: z.string().optional(),
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
          code: z.ZodIssueCode.custom,
          message: 'reader.src is required for comics',
          path: ['reader', 'src'],
        });
      }
    } else if (!data.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'image is required for illustrations',
        path: ['image'],
      });
    }
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    thumbnail: z.string(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
  }),
});

const info = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    location: z.string().optional(),
    url: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  gallery,
  posts,
  info,
};
