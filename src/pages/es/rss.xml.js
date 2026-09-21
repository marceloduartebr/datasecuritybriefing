import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { t } from '../../i18n/ui';

const SITE = 'https://dsb.duarte.top';
const locale = 'es';
const copy = t(locale);

export async function GET() {
  const posts = (await getCollection('briefings')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: copy.rssTitle,
    description: copy.rssDesc,
    site: SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/es/briefings/${post.id}`,
      customData: `<enclosure url="${post.data.cover}" type="image/jpeg" />`,
    })),
  });
}
