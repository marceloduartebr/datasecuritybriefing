"""Exports the Notion queue (data source d69d8348-…) to notion.json through the Notion REST API, read-only.
Same shape transform.py expects: one dict per page with property names as keys, dates as
'date:<Prop>:start', numbers as numbers, everything else as plain text, plus url and createdTime.
Token from the NOTION_TOKEN environment variable (an integration connected to the queue, read access is enough).
About 2 requests for ~150 pages; long rich text (25+ chunks) is completed through the property endpoint.
"""
import json, os, ssl, sys, time, urllib.error, urllib.request

DATA_SOURCE = os.environ.get('NOTION_DATA_SOURCE', 'd69d8348-e339-459d-86a1-935e6ce7fded')
VERSION = '2025-09-03'
HERE = os.path.dirname(os.path.abspath(__file__))
CA = os.environ.get('CA_BUNDLE')
CTX = ssl.create_default_context(cafile=CA) if CA and os.path.exists(CA) else ssl.create_default_context()
calls = 0


def notion(method, path, body=None):
    global calls
    for attempt in range(5):
        req = urllib.request.Request(f'https://api.notion.com/v1{path}', method=method,
                                     data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': f'Bearer {os.environ["NOTION_TOKEN"]}', 'Notion-Version': VERSION,
                                              'content-type': 'application/json'})
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
                calls += 1
                return json.load(r)
        except urllib.error.HTTPError as e:
            calls += 1
            if e.code in (429, 502, 503) and attempt < 4:
                time.sleep(float(e.headers.get('Retry-After') or 2 * (attempt + 1)))
                continue
            raise SystemExit(f'Notion {method} {path}: HTTP {e.code} {e.read()[:300]!r}')
    raise SystemExit('Notion: persistent rate limit')


def rich(arr):
    return ''.join(t.get('plain_text', '') for t in arr or [])


def full_rich(page_id, prop):
    """Rich text arrays in page objects stop at 25 items; the property endpoint paginates the rest."""
    out, cursor = [], None
    while True:
        r = notion('GET', f'/pages/{page_id}/properties/{prop["id"]}' + (f'?start_cursor={cursor}' if cursor else ''))
        for item in r.get('results', []):
            t = item.get('rich_text') or item.get('title')
            if t:
                out.append(t)
        if not r.get('has_more'):
            return rich(out)
        cursor = r.get('next_cursor')


def flatten(page):
    row = {'url': page.get('url', ''), 'createdTime': page.get('created_time')}
    for name, p in (page.get('properties') or {}).items():
        t = p.get('type')
        v = p.get(t)
        if t in ('title', 'rich_text'):
            row[name] = full_rich(page['id'], p) if len(v or []) >= 25 else rich(v)
        elif t in ('select', 'status'):
            row[name] = v.get('name') if v else None
        elif t == 'multi_select':
            row[name] = ', '.join(o['name'] for o in v or [])
        elif t == 'number':
            row[name] = v
        elif t in ('url', 'email', 'phone_number'):
            row[name] = v
        elif t == 'date':
            row[f'date:{name}:start'] = v.get('start') if v else None
        elif t == 'checkbox':
            row[name] = '__YES__' if v else '__NO__'
        elif t in ('created_time', 'last_edited_time'):
            row[name] = v
        else:
            row[name] = None
    return row


def export():
    rows, cursor = [], None
    while True:
        body = {'page_size': 100}
        if cursor:
            body['start_cursor'] = cursor
        r = notion('POST', f'/data_sources/{DATA_SOURCE}/query', body)
        rows += [flatten(p) for p in r.get('results', []) if p.get('object') == 'page' and not p.get('in_trash')]
        if not r.get('has_more'):
            return rows
        cursor = r.get('next_cursor')


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'notion.json')
    rows = export()
    if not rows:
        raise SystemExit('Notion export returned no pages; refusing to continue (the load would wipe staging).')
    json.dump(rows, open(out, 'w'), ensure_ascii=False)
    print(f'exported {len(rows)} pages in {calls} Notion request(s) → {out}')
