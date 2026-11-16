"""Casa os posts da @DSBriefing (x_timeline.json: [[tweet_id, iso, título do cartão], ...]) com os briefings do blog
pelo título do cartão do link (= title do frontmatter PT). Saída: x_match.json.
A timeline é coletada pelo navegador interno do Claude Desktop, com a busca do X em janelas de poucos dias
(from:DSBriefing since:AAAA-MM-DD until:AAAA-MM-DD, f=live), porque cada página carrega no máximo ~20 posts."""
import json, os, re, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
D = os.environ.get('DSB_CONTENT') or os.path.normpath(os.path.join(AQUI, '..', '..', '..', 'src', 'content'))
D = os.path.join(D, 'briefings')
norm = lambda s: re.sub(r'[\s"“”]+', ' ', unicodedata.normalize('NFKC', s).lower()).strip(' .…')
titulos = {}
for f in os.listdir(D):
    m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', open(os.path.join(D, f), encoding='utf-8').read(3000), re.M)
    if m:
        titulos[f[:-3]] = norm(m.group(1))
c = json.load(open(os.path.join(AQUI, 'carga.json')))
base_post = {p['url'].rsplit('/', 1)[1]: p['post_id'] for p in c['publicacoes'] if p['channel'] == 'blog' and p['lang'] == 'pt' and p['status'] == 'publicado'}
res, sem = [], []
for tid, em, tit in json.load(open(os.path.join(AQUI, 'x_timeline.json'))):
    n = norm(tit)
    hits = [b for b, t in titulos.items() if t == n or t.startswith(n)] or [b for b, t in titulos.items() if t.startswith(n[:50])]
    (res.append(dict(tweet=tid, em=em, base=hits[0], post_id=base_post[hits[0]])) if len(hits) == 1 and hits[0] in base_post else sem.append((tid, tit, hits[:3])))
json.dump(res, open(os.path.join(AQUI, 'x_match.json'), 'w'))
print('casados', len(res), 'sem casar', len(sem), *sem, sep='\n')
