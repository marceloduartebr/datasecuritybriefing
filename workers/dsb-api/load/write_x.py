"""X backfill: writes x_match.json to dsb-staging (CF_D1 as in write.py).
Matched tweets -> X published; blog articles before 2026-10-28 (when @DSBriefing started) -> X skipped;
the rest stays in the X queue. Re-enables the x_overdue check."""
import json, os
from write import q, insert, usage, HERE

START = '2026-10-28'
m = json.load(open(os.path.join(HERE, 'x_match.json')))
c = json.load(open(os.path.join(HERE, 'load.json')))
blog = {p['post_id']: p for p in c['publications'] if p['channel'] == 'blog' and p['lang'] == 'pt' and p['status'] == 'published'}
matched = {r['post_id'] for r in m}
rows = [dict(post_id=r['post_id'], channel='x', lang='pt', status='published',
             url=f"https://x.com/DSBriefing/status/{r['tweet']}", external_id=r['tweet'], published_at=r['at'],
             last_error=None, agent='x-backfill') for r in m]
before = [pid for pid, b in blog.items() if pid not in matched and (b['published_at'] or '') < START]
rows += [dict(post_id=pid, channel='x', lang='pt', status='skipped', url=None, external_id=None, published_at=None,
              last_error=f'Published on the blog before @DSBriefing started posting ({START})', agent='x-backfill') for pid in before]
pending = [pid for pid in blog if pid not in matched and pid not in before]
q("DELETE FROM publications WHERE channel = 'x'")
insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'], rows)
q("UPDATE health_checks SET enabled = 1 WHERE name = 'x_overdue'")
print('X published:', len(m), f'| skipped (before {START}):', len(before), '| no tweet, left in the X queue:', len(pending))
if pending:
    for r in q(f"""SELECT p.id, substr(p.topic,1,70) t, b.published_at FROM posts p
                   JOIN publications b ON b.post_id=p.id AND b.channel='blog' AND b.lang='pt'
                   WHERE p.id IN ({','.join(map(str, pending))}) ORDER BY b.published_at""")[0]['results']:
        print('   ', r['published_at'][:10], f"#{r['id']}", r['t'])
print('D1 usage:', usage)
