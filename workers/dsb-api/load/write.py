"""Writes load.json to dsb-staging through the D1 REST API (token read from Pass into the CF_D1 variable).
Full reload: deletes the data (not the schema, health_checks, ignored_url_patterns or competitors) and inserts with stable ids.
X publications are kept across reloads (Notion has no X column): they are saved by the post's Notion page id
before clearing and restored onto the reloaded posts (KEEP_X=0 disables this). JOB_NAME names the job run.
"""
import json, os, ssl, time, urllib.request, urllib.error

ACCT = '33755e61c66edcba424c5cf9a1f9e676'
DB = os.environ.get('D1_DATABASE_ID', '808d3914-2df5-4da9-aab7-1f19d51001d2')  # dsb-staging
URL = f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query'
_CA = os.environ.get('CA_BUNDLE', '/root/.ccr/ca-bundle.crt')  # agent proxy CA here; absent on GitHub Actions
CTX = ssl.create_default_context(cafile=_CA) if _CA and os.path.exists(_CA) else ssl.create_default_context()
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

    keep_x = os.environ.get('KEEP_X', '1') != '0'
    saved_x = []
    if keep_x:
        # Matched by the PT blog article URL (stable; an X row only exists for a post published on the blog),
        # falling back to the Notion page id.
        saved_x = q("""SELECT b.url AS blog_url, p.notion_id, x.status, x.url, x.external_id, x.body, x.published_at, x.last_error, x.agent
                       FROM publications x JOIN posts p ON p.id = x.post_id
                       LEFT JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
                       WHERE x.channel = 'x' AND x.status IN ('published','skipped')""")[0]['results']
        print(f'0) saved {len(saved_x)} X publication(s)')

    print('1) clearing staging data')
    for t in ('issues', 'post_events', 'publications', 'post_keys', 'job_runs'):
        q(f'DELETE FROM {t}')
    q('UPDATE posts SET follow_up_of = NULL')
    q('DELETE FROM posts')

    print('2) load job')
    job = q("INSERT INTO job_runs (job, agent, status) VALUES (?1, 'claude', 'running') RETURNING id",
            [os.environ.get('JOB_NAME', 'notion-full-load')])[0]['results'][0]['id']

    print('3) inserting')
    post_cols = ['id', 'notion_id', 'topic', 'status', 'type', 'country', 'priority', 'item_order', 'source_name', 'source_url', 'slug',
                 'briefing_md', 'post_text', 'image_source', 'image_url', 'added_by', 'added_at', 'approved_at', 'approval_notes',
                 'discard_reason', 'removal_reason']
    insert('posts', post_cols, c['posts'])
    for p in c['posts']:
        if p['follow_up_of']:
            q('UPDATE posts SET follow_up_of = ?1 WHERE id = ?2', [p['follow_up_of'], p['id']])
    insert('post_keys', ['key', 'post_id', 'kind'], c['keys'])
    insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'published_at', 'last_error', 'agent'],
           [dict(p, agent='notion-load') for p in c['publications']])
    x_rows = []
    if saved_x:
        by_blog = {p['url']: p['post_id'] for p in c['publications']
                   if p['channel'] == 'blog' and p['lang'] == 'pt' and p['status'] == 'published' and p.get('url')}
        by_notion = {p['notion_id']: p['id'] for p in c['posts'] if p.get('notion_id')}
        for r in saved_x:
            pid = by_blog.get(r['blog_url']) or by_notion.get(r['notion_id'])
            if pid:
                x_rows.append({k: v for k, v in r.items() if k not in ('blog_url', 'notion_id')} | {'post_id': pid, 'channel': 'x', 'lang': 'pt'})
        insert('publications', ['post_id', 'channel', 'lang', 'status', 'url', 'external_id', 'body', 'published_at', 'last_error', 'agent'], x_rows)
        if len(x_rows) < len(saved_x):
            print(f'   {len(saved_x) - len(x_rows)} X publication(s) dropped: no matching blog article or Notion page')
    insert('post_events', ['post_id', 'to_status', 'actor', 'notes'], [dict(e, actor='notion-load') for e in c['events']])
    insert('issues', ['fingerprint', 'source', 'kind', 'severity', 'stage', 'post_id', 'agent', 'summary', 'detail',
                      'suggested_action', 'job_run_id'], [dict(i, job_run_id=job) for i in c['issues']])

    print('4) closing the job')
    q("UPDATE job_runs SET status = 'ok', finished_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), items_read = ?1, items_written = ?2, notes = ?3 WHERE id = ?4",
      [len(c['posts']), len(c['posts']) + len(c['keys']) + len(c['publications']),
       f"Notion full load; load issues: {len(c['issues'])}; X kept: {len(x_rows)} of {len(saved_x)}", job])

    print('5) reconciliation')
    for r in q('SELECT status, COUNT(*) n FROM posts GROUP BY status ORDER BY status')[0]['results']:
        print('  ', r)
    for r in q('SELECT channel, lang, status, COUNT(*) n FROM publications GROUP BY 1,2,3 ORDER BY 1,2,3')[0]['results']:
        print('  ', r)
    print('   keys:', q('SELECT COUNT(*) n FROM post_keys')[0]['results'][0]['n'],
          '| follow-ups:', q('SELECT COUNT(*) n FROM posts WHERE follow_up_of IS NOT NULL')[0]['results'][0]['n'],
          '| issues:', q('SELECT COUNT(*) n FROM issues')[0]['results'][0]['n'])
    print('D1 usage:', usage)
