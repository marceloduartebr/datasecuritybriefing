import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './ui';

type PtEntry = CollectionEntry<'briefings'>;
type EsEntry = CollectionEntry<'briefingsEs'>;
type EnEntry = CollectionEntry<'briefingsEn'>;

export type BriefingView = {
  id: string;
  data: PtEntry['data'];
  entry: PtEntry | EsEntry | EnEntry;
  translated: boolean;
};

async function translatedMap(locale: Locale) {
  if (locale === 'es') {
    const rows = await getCollection('briefingsEs');
    return new Map(rows.map((row) => [row.id, row]));
  }
  if (locale === 'en') {
    const rows = await getCollection('briefingsEn');
    return new Map(rows.map((row) => [row.id, row]));
  }
  return new Map<string, EsEntry | EnEntry>();
}

export async function listBriefings(locale: Locale): Promise<BriefingView[]> {
  const pt = (await getCollection('briefings')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const extra = await translatedMap(locale);
  return pt.map((post) => {
    const hit = extra.get(post.id);
    return {
      id: post.id,
      data: hit ? hit.data : post.data,
      entry: hit ?? post,
      translated: Boolean(hit),
    };
  });
}
