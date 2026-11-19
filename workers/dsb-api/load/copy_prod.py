"""STG refresh after the cutover: copies the production D1 (dsb-prod) into dsb-staging, D1 to D1.

Notion is frozen since the cutover (2026-11-18), so the nightly STG sync copies production instead.
- Source dsb-prod is only ever read: every source query must be a SELECT (checked in src()).
- Target dsb-staging is fully reloaded: data tables are cleared and refilled with the same ids as production,
  so a post is #160 on both. Config tables (competitors, ignored_url_patterns) are mirrored too; the schema,
  views and health_checks stay as the migrations made them.
- Refuses to run if the target is the production database.
Env: CF_D1 (Cloudflare token with D1 read on dsb-prod and D1 edit on dsb-staging), optional SRC_DB / DST_DB,
JOB_NAME (default prod-stg-refresh), DRY_RUN=1 (read and count only, write nothing).
"""
import json, os, ssl, time, urllib.request, urllib.error

ACCT = '33755e61c66edcba424c5cf9a1f9e676'
PROD = 'd181dd85-78d4-4081-83a9-ead6e674aaf6'      # dsb-prod
STAGING = '808d3914-2df5-4da9-aab7-1f19d51001d2'   # dsb-staging
SRC = os.environ.get('SRC_DB', PROD)
DST = os.environ.get('DST_DB', STAGING)
DRY = os.environ.get('DRY_RUN') == '1'
_CA = os.environ.get('CA_BUNDLE', '/root/.ccr/ca-bundle.crt')  # agent proxy CA here; absent on GitHub Actions
CTX = ssl.create_default_context(cafile=_CA) if _CA and os.path.exists(_CA) else ssl.create_default_context()
TOKEN = os.environ['CF_D1']
usage = {'calls': 0, 'rows_read': 0, 'rows_written': 0}

# Copy order respects the foreign keys; clearing runs in reverse.
DATA = ['job_runs', 'posts', 'post_keys', 'publications', 'post_events', 'issues']
CONFIG = ['competitors', 'ignored_url_patterns']


def _q(db, sql, params=None):
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{db}/query'
    body = json.dumps({'sql': sql, 'params': params or []}).encode()
    for attempt in range(4):
        req = urllib.request.Request(url, data=body, method='POST',
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
        return j['result'][0]['results']
    raise SystemExit('D1: persistent rate limit')


def src(sql, params=None):
    if not sql.lstrip().upper().startswith(('SELECT', 'PRAGMA TABLE_INFO')):
        raise SystemExit('refusing a non-read query on the production database')
    return _q(SRC, sql, params)


def dst(sql, params=None):
    if DRY:
        return []
    return _q(DST, sql, params)


def columns(table):
    return [c['name'] for c in src(f'PRAGMA table_info({table})')]


def read_all(table, cols):
    rows, last = [], None
    order = 'id' if 'id' in cols else cols[0]
    while True:  # page by the key so one call never returns too much
        where = f'WHERE {order} > ?1' if last is not None else ''
        chunk = src(f'SELECT {",".join(cols)} FROM {table} {where} ORDER BY {order} LIMIT 200', [last] if last is not None else [])
        rows += chunk
        if len(chunk) < 200:
            return rows
        last = chunk[-1][order]


def topological(posts):
    """Parents before follow-ups, so the follow_up_of foreign key holds on every insert."""
    by_id, done, out = {p['id']: p for p in posts}, set(), []
    def visit(p):
        if p['id'] in done:
            return
        parent = by_id.get(p.get('follow_up_of'))
        if parent:
            visit(parent)
        done.add(p['id']); out.append(p)
    for p in sorted(posts, key=lambda p: p['id']):
        visit(p)
    return out


def insert(table, cols, rows):
    per = max(1, 100 // len(cols))  # D1: at most 100 bound parameters per statement
    for i in range(0, len(rows), per):
        chunk = rows[i:i + per]
        ph = ','.join('(' + ','.join('?' * len(cols)) + ')' for _ in chunk)
        dst(f'INSERT INTO {table} ({",".join(cols)}) VALUES {ph}', [r.get(c) for r in chunk for c in cols])


if __name__ == '__main__':
    if DST == PROD or DST == SRC:
        raise SystemExit('refusing to write: the target is the production database')
    print(f'source {SRC} (read only) → target {DST}{" (dry run)" if DRY else ""}')

    data = {}
    for t in CONFIG + DATA:
        cols = columns(t)
        data[t] = (cols, read_all(t, cols))
        print(f'  read {t}: {len(data[t][1])}')
    tcols = {t: [c['name'] for c in _q(DST, f'PRAGMA table_info({t})')] for t in CONFIG + DATA}
    for t in CONFIG + DATA:
        if set(data[t][0]) != set(tcols[t]):
            raise SystemExit(f'schema differs on {t}: prod {sorted(data[t][0])} vs staging {sorted(tcols[t])}; apply the migrations first')

    print('1) clearing staging')
    dst('UPDATE posts SET follow_up_of = NULL')
    for t in reversed(DATA):
        dst(f'DELETE FROM {t}')
    for t in CONFIG:
        dst(f'DELETE FROM {t}')

    print('2) copying')
    for t in CONFIG + DATA:
        cols, rows = data[t]
        insert(t, cols, topological(rows) if t == 'posts' else rows)
        print(f'  {t}: {len(rows)}')

    print('3) refresh job')
    n_posts = len(data['posts'][1])
    written = sum(len(r) for _, r in data.values())
    dst("INSERT INTO job_runs (job, agent, status, finished_at, items_read, items_written, notes) "
        "VALUES (?1, 'claude', 'ok', strftime('%Y-%m-%dT%H:%M:%fZ','now'), ?2, ?3, ?4)",
        [os.environ.get('JOB_NAME', 'prod-stg-refresh'), n_posts, written, 'STG refresh: copy of dsb-prod (D1 to D1)'])

    print('4) reconciliation (staging vs production)')
    ok = True
    for t in CONFIG + DATA:
        a = src(f'SELECT COUNT(*) n FROM {t}')[0]['n']
        b = a if DRY else _q(DST, f'SELECT COUNT(*) n FROM {t}')[0]['n'] - (1 if t == 'job_runs' else 0)
        flag = '' if a == b else '  ← differs (production changed during the copy?)'
        ok = ok and a == b
        print(f'  {t}: prod {a} · staging {b}{flag}')
    for r in ([] if DRY else _q(DST, 'SELECT status, COUNT(*) n FROM posts GROUP BY status ORDER BY status')):
        print('  ', r)
    print('D1 usage:', usage)
    if not ok:
        print('WARNING: counts differ; rerun the workflow')
