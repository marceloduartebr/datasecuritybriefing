"""Grava carga.json na dsb-staging via API REST do D1 (token lido do Pass pela variável CF_D1).
Recarga full: apaga os dados (não o schema nem health_checks/ignored_url_patterns) e insere com ids estáveis.
"""
import json, os, ssl, sys, time, urllib.request

ACCT = '33755e61c66edcba424c5cf9a1f9e676'
DB = '808d3914-2df5-4da9-aab7-1f19d51001d2'
URL = f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
TOKEN = os.environ['CF_D1']
AQUI = os.path.dirname(os.path.abspath(__file__))
c = json.load(open(os.path.join(AQUI, 'carga.json')))
uso = {'rows_read': 0, 'rows_written': 0, 'chamadas': 0}


def q(sql, params=None):
    body = json.dumps({'sql': sql, 'params': params or []}).encode()
    for tentativa in range(4):
        req = urllib.request.Request(URL, data=body, method='POST',
                                     headers={'Authorization': f'Bearer {TOKEN}', 'content-type': 'application/json'})
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
                j = json.load(r)
        except urllib.error.HTTPError as e:
            j = json.load(e)
            if any(x.get('code') in (971, 10013) for x in j.get('errors', [])) and tentativa < 3:
                time.sleep(5 * (tentativa + 1))
                continue
        uso['chamadas'] += 1
        if not j.get('success'):
            raise SystemExit(f'ERRO D1: {j.get("errors")} em {sql[:120]}')
        for res in j['result']:
            m = res.get('meta') or {}
            uso['rows_read'] += m.get('rows_read', 0)
            uso['rows_written'] += m.get('rows_written', 0)
        return j['result']
    raise SystemExit('D1: limite de requisições persistente')


def inserir(tabela, colunas, linhas):
    por = max(1, 100 // len(colunas))
    for i in range(0, len(linhas), por):
        lote = linhas[i:i + por]
        ph = ','.join('(' + ','.join('?' * len(colunas)) + ')' for _ in lote)
        params = [l.get(col) for l in lote for col in colunas]
        q(f'INSERT INTO {tabela} ({",".join(colunas)}) VALUES {ph}', params)
    print(f'  {tabela}: {len(linhas)}')


print('1) limpando dados da staging')
for t in ('issues', 'post_events', 'publications', 'post_keys', 'job_runs'):
    q(f'DELETE FROM {t}')
q('UPDATE posts SET follow_up_of = NULL')
q('DELETE FROM posts')

print('2) job da carga')
job = q("INSERT INTO job_runs (job, agent, status) VALUES ('carga-full-notion', 'Claude_Assistant', 'running') RETURNING id")[0]['results'][0]['id']

print('3) inserindo')
cols_post = ['id', 'notion_id', 'topic', 'status', 'tipo', 'pais', 'priority', 'item_order', 'source_name', 'source_url', 'slug',
             'briefing_md', 'post_text', 'image_source', 'image_url', 'added_by', 'added_at', 'approved_at', 'approval_notes',
             'discard_reason']
inserir('posts', cols_post, c['posts'])
for p in c['posts']:
    if p['follow_up_of']:
        q('UPDATE posts SET follow_up_of = ?1 WHERE id = ?2', [p['follow_up_of'], p['id']])
inserir('post_keys', ['key', 'post_id', 'kind'], c['chaves'])
inserir('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error'],
        [dict(p, agent='carga-notion') for p in c['publicacoes']])
inserir('post_events', ['post_id', 'to_status', 'actor', 'notes'], [dict(e, actor='carga-notion') for e in c['eventos']])
inserir('issues', ['fingerprint', 'source', 'kind', 'severity', 'stage', 'post_id', 'agent', 'summary', 'detail',
                   'suggested_action', 'job_run_id'], [dict(i, job_run_id=job) for i in c['pendencias']])

print('4) fechando o job')
q("UPDATE job_runs SET status = 'ok', finished_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), items_read = ?1, items_written = ?2, notes = ?3 WHERE id = ?4",
  [len(c['posts']), len(c['posts']) + len(c['chaves']) + len(c['publicacoes']),
   f"carga full do Notion; pendências de carga: {len(c['pendencias'])}", job])

print('5) reconciliação')
for r in q("SELECT status, COUNT(*) n FROM posts GROUP BY status ORDER BY status")[0]['results']:
    print('  ', r)
for r in q("SELECT channel, lang, status, COUNT(*) n FROM publications GROUP BY 1,2,3 ORDER BY 1,2,3")[0]['results']:
    print('  ', r)
print('   chaves:', q('SELECT COUNT(*) n FROM post_keys')[0]['results'][0]['n'],
      '| follow-ups:', q('SELECT COUNT(*) n FROM posts WHERE follow_up_of IS NOT NULL')[0]['results'][0]['n'],
      '| pendências:', q('SELECT COUNT(*) n FROM issues')[0]['results'][0]['n'])
print('uso D1:', uso)
