import { defineCollection, z } from 'astro:content';

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    image: z.string(),
    thumbnail: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
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
