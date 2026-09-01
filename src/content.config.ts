import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const briefings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/briefings' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    sourceName: z.string(),
    sourceUrl: z.string().url(),
    cover: z.string().url(),
    tags: z.array(z.string()),
    tipo: z.enum(['incidente', 'noticia']).default('incidente'),
    notionUrl: z.string().url().optional(),
  }),
});

export const collections = { briefings };
