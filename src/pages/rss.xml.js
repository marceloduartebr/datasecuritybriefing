import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('briefings')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: 'Data Security Briefing',
    description: 'Vazamentos, DSPM e regulação LGPD/ANPD na América Latina.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/briefings/${post.id}`,
      customData: `<enclosure url="${post.data.cover}" type="image/jpeg" />`,
    })),
  });
}
