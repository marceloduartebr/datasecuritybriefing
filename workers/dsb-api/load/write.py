"""Writes load.json to dsb-staging through the D1 REST API (token read from Pass into the CF_D1 variable).
Full reload: deletes the data (not the schema, health_checks, ignored_url_patterns or competitors) and inserts with stable ids.
"""
import json, os, ssl, time, urllib.request, urllib.error

ACCT = '33755e61c66edcba424c5cf9a1f9e676'
DB = os.environ.get('D1_DATABASE_ID', '808d3914-2df5-4da9-aab7-1f19d51001d2')  # dsb-staging
URL = f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query'
CTX = ssl.create_default_context(cafile=os.environ.get('CA_BUNDLE', '/root/.ccr/ca-bundle.crt'))
TOKEN = os.environ['CF_D1']
HERE = os.path.dirname(os.path.abspath(__file__))
usage = {'rows_read': 0, 'rows_written': 0, 'calls': 0}


def q(sql, params=None):
    body = json.dumps({'sql': sql, 'params': params or []}).encode()
    for attempt in range(4):
        req = urllib.request.Request(URL, data=body, method='POST',
                                     headers={'Authorization': f'Bearer {TOKEN}', 'content-type': 'application/json'})
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
                j = json.load(r)
        except urllib.error.HTTPError as e:
            j = json.load(e)
            if any(x.get('code') in (971, 10013) for x in j.get('errors', [])) and attempt < 3:
                time.sleep(5 * (attempt + 1))
                continue
        usage['calls'] += 1
        if not j.get('success'):
            raise SystemExit(f'D1 ERROR: {j.get("errors")} in {sql[:120]}')
        for res in j['result']:
            m = res.get('meta') or {}
            usage['rows_read'] += m.get('rows_read', 0)
            usage['rows_written'] += m.get('rows_written', 0)
        return j['result']
    raise SystemExit('D1: persistent rate limit')


def insert(table, columns, rows):
    per = max(1, 100 // len(columns))  # D1: at most 100 bound parameters per statement
    for i in range(0, len(rows), per):
        chunk = rows[i:i + per]
        ph = ','.join('(' + ','.join('?' * len(columns)) + ')' for _ in chunk)
        q(f'INSERT INTO {table} ({",".join(columns)}) VALUES {ph}', [row.get(col) for row in chunk for col in columns])
    print(f'  {table}: {len(rows)}')


if __name__ == '__main__':
    c = json.load(open(os.path.join(HERE, 'load.json')))

    print('1) clearing staging data')
    for t in ('issues', 'post_events', 'publications', 'post_keys', 'job_runs'):
        q(f'DELETE FROM {t}')
    q('UPDATE posts SET follow_up_of = NULL')
    q('DELETE FROM posts')

    print('2) load job')
    job = q("INSERT INTO job_runs (job, agent, status) VALUES ('notion-full-load', 'claude', 'running') RETURNING id")[0]['results'][0]['id']

    print('3) inserting')
    post_cols = ['id', 'notion_id', 'topic', 'status', 'type', 'country', 'priority', 'item_order', 'source_name', 'source_url', 'slug',
                 'briefing_md', 'post_text', 'image_source', 'image_url', 'added_by', 'added_at', 'approved_at', 'approval_notes',
                 'discard_reason']
    insert('posts', post_cols, c['posts'])
    for p in c['posts']:
        if p['follow_up_of']:
            q('UPDATE posts SET follow_up_of = ?1 WHERE id = ?2', [p['follow_up_of'], p['id']])
    insert('post_keys', ['key', 'post_id', 'kind'], c['keys'])
    insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'],
           [dict(p, agent='notion-load') for p in c['publications']])
    insert('post_events', ['post_id', 'to_status', 'actor', 'notes'], [dict(e, actor='notion-load') for e in c['events']])
    insert('issues', ['fingerprint', 'source', 'kind', 'severity', 'stage', 'post_id', 'agent', 'summary', 'detail',
                      'suggested_action', 'job_run_id'], [dict(i, job_run_id=job) for i in c['issues']])

    print('4) closing the job')
    q("UPDATE job_runs SET status = 'ok', finished_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), items_read = ?1, items_written = ?2, notes = ?3 WHERE id = ?4",
      [len(c['posts']), len(c['posts']) + len(c['keys']) + len(c['publications']),
       f"Notion full load; load issues: {len(c['issues'])}", job])

    print('5) reconciliation')
    for r in q('SELECT status, COUNT(*) n FROM posts GROUP BY status ORDER BY status')[0]['results']:
        print('  ', r)
    for r in q('SELECT channel, lang, status, COUNT(*) n FROM publications GROUP BY 1,2,3 ORDER BY 1,2,3')[0]['results']:
        print('  ', r)
    print('   keys:', q('SELECT COUNT(*) n FROM post_keys')[0]['results'][0]['n'],
          '| follow-ups:', q('SELECT COUNT(*) n FROM posts WHERE follow_up_of IS NOT NULL')[0]['results'][0]['n'],
          '| issues:', q('SELECT COUNT(*) n FROM issues')[0]['results'][0]['n'])
    print('D1 usage:', usage)
