import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { briefingEntryId } from './lib/briefing-id';

const briefingSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  cover: z.string().url(),
  tags: z.array(z.string()),
  tipo: z.enum(['incidente', 'noticia', 'vulnerabilidades']).default('incidente'),
  pais: z.enum(['br', 'mx', 'ar', 'cl', 'pe', 'py', 'uy', 'co', 'us', 'eu', 'latam', 'global']).optional(),
  notionUrl: z.string().url().optional(),
});

function briefingLoader(base: string) {
  return glob({
    pattern: '*.md',
    base,
    generateId: ({ entry }) => briefingEntryId(entry),
  });
}

const briefings = defineCollection({
  loader: briefingLoader('./src/content/briefings'),
  schema: briefingSchema,
});

const briefingsEs = defineCollection({
  loader: briefingLoader('./src/content/briefings-es'),
  schema: briefingSchema,
});

const briefingsEn = defineCollection({
  loader: briefingLoader('./src/content/briefings-en'),
  schema: briefingSchema,
});

export const collections = { briefings, briefingsEs, briefingsEn };
