"""X backfill: writes x_match.json to dsb-staging (CF_D1 as in write.py).
Posts are resolved from the database by their PT blog article URL, so this works on top of any reload
(full load or nightly sync). Matched tweets -> X published; blog articles before 2026-10-28 (when @DSBriefing
started) -> X skipped; the rest stays in the X queue. Re-enables the x_overdue check."""
import json, os
from write import q, insert, usage, HERE

START = '2026-10-28'
SITE = 'https://dsb.duarte.top/briefings/'
m = json.load(open(os.path.join(HERE, 'x_match.json')))
blog = {r['url']: r for r in q("""SELECT post_id, url, published_at FROM publications
                                  WHERE channel = 'blog' AND lang = 'pt' AND status = 'published'""")[0]['results']}
rows, matched, missing = [], set(), []
for r in m:
    b = blog.get(SITE + r['base'])
    if not b:
        missing.append(r['base'])
        continue
    matched.add(b['post_id'])
    rows.append(dict(post_id=b['post_id'], channel='x', lang='pt', status='published',
                     url=f"https://x.com/DSBriefing/status/{r['tweet']}", external_id=r['tweet'], published_at=r['at'],
                     last_error=None, agent='x-backfill'))
before = [b['post_id'] for b in blog.values() if b['post_id'] not in matched and (b['published_at'] or '') < START]
rows += [dict(post_id=pid, channel='x', lang='pt', status='skipped', url=None, external_id=None, published_at=None,
              last_error=f'Published on the blog before @DSBriefing started posting ({START})', agent='x-backfill') for pid in before]
pending = [b['post_id'] for b in blog.values() if b['post_id'] not in matched and b['post_id'] not in before]
q("DELETE FROM publications WHERE channel = 'x'")
insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'], rows)
q("UPDATE health_checks SET enabled = 1 WHERE name = 'x_overdue'")
print('X published:', len(rows) - len(before), f'| skipped (before {START}):', len(before), '| no tweet, left in the X queue:', len(pending))
if missing:
    print('   tweets whose blog article is not in staging:', missing)
if pending:
    for r in q(f"""SELECT p.id, substr(p.topic,1,70) t, b.published_at FROM posts p
                   JOIN publications b ON b.post_id=p.id AND b.channel='blog' AND b.lang='pt'
                   WHERE p.id IN ({','.join(map(str, pending))}) ORDER BY b.published_at""")[0]['results']:
        print('   ', r['published_at'][:10], f"#{r['id']}", r['t'])
print('D1 usage:', usage)
