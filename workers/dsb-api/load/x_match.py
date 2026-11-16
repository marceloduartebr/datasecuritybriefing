"""Matches @DSBriefing posts (x_timeline.json: [[tweet_id, iso, link card title], ...]) to blog briefings
by the link card title (= PT frontmatter title). Output: x_match.json.
The timeline is collected with the Claude desktop built-in browser, using X search in windows of a few days
(from:DSBriefing since:YYYY-MM-DD until:YYYY-MM-DD, f=live), because each page loads at most ~20 posts."""
import json, os, re, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
D = os.environ.get('DSB_CONTENT') or os.path.normpath(os.path.join(HERE, '..', '..', '..', 'src', 'content'))
D = os.path.join(D, 'briefings')
norm = lambda s: re.sub(r'[\s"“”]+', ' ', unicodedata.normalize('NFKC', s).lower()).strip(' .…')
titles = {}
for f in os.listdir(D):
    m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', open(os.path.join(D, f), encoding='utf-8').read(3000), re.M)
    if m:
        titles[f[:-3]] = norm(m.group(1))
c = json.load(open(os.path.join(HERE, 'load.json')))
post_of = {p['url'].rsplit('/', 1)[1]: p['post_id'] for p in c['publications']
           if p['channel'] == 'blog' and p['lang'] == 'pt' and p['status'] == 'published'}
matched, unmatched = [], []
for tid, at, title in json.load(open(os.path.join(HERE, 'x_timeline.json'))):
    n = norm(title)
    hits = [b for b, t in titles.items() if t == n or t.startswith(n)] or [b for b, t in titles.items() if t.startswith(n[:50])]
    if len(hits) == 1 and hits[0] in post_of:
        matched.append(dict(tweet=tid, at=at, base=hits[0], post_id=post_of[hits[0]]))
    else:
        unmatched.append((tid, title, hits[:3]))
json.dump(matched, open(os.path.join(HERE, 'x_match.json'), 'w'))
print('matched', len(matched), 'unmatched', len(unmatched), *unmatched, sep='\n')
