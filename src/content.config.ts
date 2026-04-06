import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

const mvp = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mvp' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(['testing', 'done', 'abandoned']),
    tags: z.array(z.string()),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    status: z.enum(['raw', 'thinking', 'testing', 'done', 'abandoned']),
  }),
});

export const collections = { thinking, mvp, ideas };
