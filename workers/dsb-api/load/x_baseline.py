"""X baseline for the production load (cutover): Notion has no record of Grok's X posts, so without this every
article already on the blog would land in the X queue and could be posted again.
1. X publications known on dsb-staging (backfill + nightly KEEP_X) are copied by PT blog article URL.
2. Every other post with the PT blog article published and no X row -> X skipped ("before the cutover").
Target: D1_DATABASE_ID (dsb-prod); source: STG_DATABASE_ID (default dsb-staging). Token: CF_D1 (D1 read on both)."""
import os
import write
from write import q, insert

TARGET = write.DB
use = lambda db: setattr(write, 'URL', f'https://api.cloudflare.com/client/v4/accounts/{write.ACCT}/d1/database/{db}/query')
SOURCE = os.environ.get('STG_DATABASE_ID', '808d3914-2df5-4da9-aab7-1f19d51001d2')
if TARGET == SOURCE:
    raise SystemExit('x_baseline: target and source are the same database')

use(SOURCE)
known = q("""SELECT b.url AS blog_url, x.status, x.url, x.external_id, x.published_at, x.last_error, x.agent
             FROM publications x JOIN publications b ON b.post_id = x.post_id AND b.channel = 'blog' AND b.lang = 'pt'
             WHERE x.channel = 'x' AND x.status IN ('published','skipped') AND b.url IS NOT NULL""")[0]['results']
use(TARGET)
blog = {r['url']: r['post_id'] for r in q("""SELECT post_id, url FROM publications
                                              WHERE channel = 'blog' AND lang = 'pt' AND status = 'published'""")[0]['results']}
have_x = {r['post_id'] for r in q("SELECT post_id FROM publications WHERE channel = 'x'")[0]['results']}
rows, copied = [], set()
for k in known:
    pid = blog.get(k['blog_url'])
    if pid and pid not in have_x and pid not in copied:
        copied.add(pid)
        rows.append(dict(post_id=pid, channel='x', lang='pt', status=k['status'], url=k['url'], external_id=k['external_id'],
                         published_at=k['published_at'], last_error=k['last_error'], agent=k['agent'] or 'x-backfill'))
skipped = [pid for pid in blog.values() if pid not in have_x and pid not in copied]
rows += [dict(post_id=pid, channel='x', lang='pt', status='skipped', url=None, external_id=None, published_at=None,
              last_error='Published on the blog before the cutover (X history kept by Grok on Notion)', agent='x-baseline')
         for pid in skipped]
if rows:
    insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'], rows)
print(f'X baseline: copied from staging {len(copied)} | skipped before cutover {len(skipped)} | blog posts {len(blog)}')
