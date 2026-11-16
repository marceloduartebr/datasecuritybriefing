import json, os, sys
sys.argv = ['x']
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "gravar.py")).read().split("print('1) limpando")[0])  # reaproveita q() e inserir()
m = json.load(open('x_match.json'))
c = json.load(open('carga.json'))
blog = {p['post_id']: p for p in c['publicacoes'] if p['channel'] == 'blog' and p['lang'] == 'pt' and p['status'] == 'publicado'}
casados = {r['post_id'] for r in m}
linhas = [dict(post_id=r['post_id'], channel='x', lang='pt', status='publicado',
               url=f"https://x.com/DSBriefing/status/{r['tweet']}", external_id=r['tweet'], published_at=r['em'],
               last_error=None, agent='backfill-x') for r in m]
antes = [pid for pid, b in blog.items() if pid not in casados and (b['published_at'] or '') < '2026-10-28']
linhas += [dict(post_id=pid, channel='x', lang='pt', status='pulado', url=None, external_id=None, published_at=None,
                last_error='Publicado no blog antes de a @DSBriefing começar a postar (28/10/2026)', agent='backfill-x') for pid in antes]
pendentes = [pid for pid in blog if pid not in casados and pid not in antes]
q("DELETE FROM publications WHERE channel = 'x'")
inserir('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'], linhas)
q("UPDATE health_checks SET enabled = 1, description = 'Blog há mais de 2 dias sem X' WHERE name = 'x_atrasado'")
print('X publicado:', len(m), '| pulado (antes de 28/10):', len(antes), '| sem tweet, ficam na fila do X:', len(pendentes))
for r in q(f"SELECT p.id, substr(p.topic,1,70) t, b.published_at FROM posts p JOIN publications b ON b.post_id=p.id AND b.channel='blog' AND b.lang='pt' WHERE p.id IN ({','.join(map(str,pendentes)) or '0'}) ORDER BY b.published_at")[0]['results']:
    print('   ', r['published_at'][:10], f"#{r['id']}", r['t'])
print('uso D1:', uso)
