"""Transforms the Notion queue export (notion.json) into the D1 schema (load.json).

Rules (decisions of 2026-11-16):
- D1 status is editorial: published = PT blog article published (or skipped).
- Notion "Publicado" + Blog URL with a file in the repo -> blog pt/es/en published.
- Notion Status "Removed" (or a Blog URL without a file in the repo) -> the post was pulled back: status removed, with
  the reason and date taken from the "Removido ..." note in Publish Notes. A channel still live (blog file present, or
  LinkedIn without "Removido do LinkedIn" in the notes) loads as removal_pending, so the removal_pending check raises it.
  A missing blog file on a post not marked Removed is reported (load_removed_post) to set the status in Notion.
  "linkedin-only" -> blog skipped.
- LinkedIn URN in Publish Notes -> linkedin publication published; no URN -> published without URL + issue.
- Keys: CVEs (Topic + Post Text; Briefing MD only when there is no other key) and the normalized URL unless generic.
- Key collision: Hospital Clinico U. Chile -> follow_up_of; a repeated CVE -> the newer post is a follow-up of the
  older one (decision of 2026-11-16); a repeated URL -> the key stays with the oldest post + issue.
- Nothing is dropped silently: every special case becomes an issue (source=agent, stage=load).
- Notion values are mapped to the English enums below; an unknown value stops the load.
"""
import json, os, re, sys
from collections import Counter
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get('DSB_CONTENT') or os.path.normpath(os.path.join(HERE, '..', '..', '..', 'src', 'content'))
SITE = 'https://dsb.duarte.top'
GENERIC = [
    ('https://www.cisa.gov/known-exploited-vulnerabilities-catalog', None),
    ('https://www.cisa.gov/news-events/alerts/', '/cisa-adds-'),
]
FOLLOW_UPS = {'hospital-clinico-uchile-imagenologia': 'hospital-clinico-uchile-imagem'}
TRACKING = re.compile(r'^(utm_.*|fbclid|gclid|mc_cid|mc_eid|ref|ref_src|igshid|si|s)$', re.I)

STATUS = {'Novo': 'new', 'Aprovado': 'approved', 'Publicado': 'published', 'Descartado': 'discarded', 'Removed': 'removed'}
TYPE = {'Incidente': 'incident', 'Notícia': 'news', 'Vulnerabilidades': 'vulnerability'}
PRIORITY = {'Normal': 'normal', 'Alta': 'high'}
ADDED_BY = {'user': 'user', 'assistant_research': 'research', 'Grok_Assistant': 'grok', 'Claude_Assistant': 'claude'}

INPUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'notion.json')
rows = json.load(open(INPUT))
files = {l: set(os.listdir(f'{REPO}/{d}')) for l, d in (('pt', 'briefings'), ('es', 'briefings-es'), ('en', 'briefings-en'))}


def mapped(table, value, field):
    if value not in table:
        raise SystemExit(f'Unknown Notion value for {field}: {value!r}')
    return table[value]


def norm_url(u):
    p = urlsplit(u.strip())
    q = sorted((k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if not TRACKING.match(k))
    path = p.path.rstrip('/') or '/'
    return urlunsplit((p.scheme, p.hostname.lower() + (f':{p.port}' if p.port else ''), path, urlencode(q), ''))


def is_generic(u):
    return any(u.startswith(pre) and (c is None or c in u) for pre, c in GENERIC)


def cves(*texts):
    out = []
    for t in texts:
        for m in re.findall(r'CVE-\d{4}-\d{4,7}', t or '', re.I):
            m = m.upper()
            if m not in out:
                out.append(m)
    return out


def iso(v):
    if not v:
        return None
    return v.replace(' ', 'T') if re.match(r'^\d{4}-\d{2}-\d{2} \d', v) else v


def notion_id(url):
    # The page id is the last 32 hex digits of the URL path; REST URLs put the title (which can end in a-f) before it.
    path = urlsplit(url).path.replace('-', '')
    m = re.search(r'([0-9a-f]{32})$', path)
    return m.group(1) if m else None


issues = []


def issue(fp, kind, sev, summary, post_id=None, detail=None, action=None):
    issues.append(dict(fingerprint=f'agent:load:{fp}', source='agent', kind=kind, severity=sev, stage='load',
                       post_id=post_id, agent='claude', summary=summary[:500],
                       detail=json.dumps(detail, ensure_ascii=False) if detail else None, suggested_action=action))


# chronological order for stable ids and for the "key stays with the oldest" rule
rows.sort(key=lambda r: (iso(r.get('date:Added At:start')) or r['createdTime'], r['url']))

posts, keys, pubs, events = [], [], [], []
by_id = {}         # post_id -> post (for follow-up roots)
owner = {}         # key -> post_id
by_slug = {}       # slug -> post_id
used_slugs = set()

for pid, r in enumerate(rows, start=1):
    notion_status = r['Status']
    status = mapped(STATUS, notion_status, 'Status')
    blog = (r.get('Blog URL') or '').strip()
    notes = r.get('Publish Notes') or ''
    pub_at = iso(r.get('date:Published At:start'))
    added_at = iso(r.get('date:Added At:start')) or r['createdTime']

    # slug: the property; otherwise from the Blog URL (without the date); repeated -> from the Blog URL
    slug = (r.get('Slug') or '').strip() or None
    m = re.match(r'^https://dsb\.duarte\.top/briefings/(?:(\d{4}-\d{2}-\d{2})-)?([a-z0-9-]+)/?$', blog)
    slug_blog = m.group(2) if m else None
    if not slug and slug_blog:
        slug = slug_blog
        issue(f'slug_from_blog:{pid}', 'load_slug_derived', 'info', f'Empty slug in Notion; derived from the Blog URL: {slug}', pid)
    if slug and slug in used_slugs:
        alt = slug_blog if slug_blog and slug_blog not in used_slugs else f'{slug}-{pid}'
        issue(f'slug_repeated:{pid}', 'load_slug_repeated', 'warning',
              f'Slug "{slug}" repeated in Notion; this post got "{alt}"', pid,
              {'notion_slug': slug, 'd1_slug': alt, 'topic': r['Topic']}, 'Check which slug matches the blog file')
        slug = alt
    if slug:
        used_slugs.add(slug)
        by_slug[slug] = pid

    if status == 'published' and not pub_at:
        pub_at = iso(r.get('date:Approved At:start')) or added_at
        issue(f'missing_published_at:{pid}', 'load_missing_date', 'info',
              'Published without Published At in Notion; used the approval/added date', pid)

    img_src = r.get('Image Source') or 'none'
    img_url = r.get('Image URL') or None if img_src != 'none' else None

    discard = None
    if status == 'discarded':
        discard = f"Imported from Notion: {(r.get('Approval Notes') or 'no reason recorded')[:400]}"

    posts.append(dict(
        id=pid, notion_id=notion_id(r['url']), topic=r['Topic'], status=status, type=mapped(TYPE, r['Tipo'], 'Tipo'),
        country=r.get('Pais') or None, priority=mapped(PRIORITY, r.get('Priority') or 'Normal', 'Priority'),
        item_order=r.get('Order'), source_name=r.get('Source Name') or None,
        source_url=norm_url(r['Source URL']), slug=slug, briefing_md=r.get('Briefing MD') or None,
        post_text=r.get('Post Text') or None, image_source=img_src, image_url=img_url,
        added_by=mapped(ADDED_BY, r.get('Added By') or 'user', 'Added By'), added_at=added_at,
        approved_at=iso(r.get('date:Approved At:start')),
        approval_notes=r.get('Approval Notes') or None, discard_reason=discard, follow_up_of=None))
    by_id[pid] = posts[-1]
    if not r.get('Pais'):
        issue(f'missing_country:{pid}', 'load_missing_country', 'info', f'Post without a country in Notion: {r["Topic"][:120]}', pid,
              action='Set the country of the post')

    # blog publications
    removed = False                      # blog file gone from the repo
    notion_removed = status == 'removed'  # Status = Removed in Notion
    live = 'removal_pending' if notion_removed else 'published'
    if blog == 'linkedin-only':
        pubs.append(dict(post_id=pid, channel='blog', lang='pt', status='skipped', url=None, external_id=None, published_at=None,
                         last_error='linkedin-only: promotion of the blog itself, no page'))
    elif blog:
        arq = f'{blog.rstrip("/").split("/")[-1]}.md'
        if not m or not m.group(1):
            issue(f'blog_url_without_date:{pid}', 'load_blog_url_nonstandard', 'warning',
                  f'Blog URL without the date in the path: {blog}', pid,
                  action='Change it to https://dsb.duarte.top/briefings/YYYY-MM-DD-slug')
            cand = [f for f in files['pt'] if f.endswith(f'-{slug_blog}.md')] if slug_blog else []
            arq = cand[0] if len(cand) == 1 else arq
        if arq in files['pt']:
            base = arq[:-3]
            pubs.append(dict(post_id=pid, channel='blog', lang='pt', status=live, url=f'{SITE}/briefings/{base}',
                             external_id=None, published_at=pub_at, last_error=None))
            for l in ('es', 'en'):
                if arq in files[l]:
                    pubs.append(dict(post_id=pid, channel='blog', lang=l, status=live, url=f'{SITE}/{l}/briefings/{base}',
                                     external_id=None, published_at=pub_at, last_error=None))
        else:
            removed = True
            pubs.append(dict(post_id=pid, channel='blog', lang='pt', status='removed', url=blog, external_id=None, published_at=pub_at,
                             last_error=None))
            if not notion_removed:
                issue(f'removed_before_migration:{pid}', 'load_removed_post', 'info',
                      f'Recorded as removed (blog article deleted from the repository): {r["Topic"][:120]}', pid,
                      {'blog_url': blog}, 'Set Status = Removed in Notion with the "Removido ..." note in Publish Notes')

    # LinkedIn (Publicado in Notion = it went out on LinkedIn)
    urn = re.search(r'urn:li:(?:share|ugcPost|activity):[0-9A-Za-z]+', notes)
    li_removed = removed or bool(re.search(r'removid[oa] do linkedin', notes, re.I))
    li_status = 'removed' if li_removed else live
    if urn:
        pubs.append(dict(post_id=pid, channel='linkedin', lang='pt', status=li_status,
                         url=f'https://www.linkedin.com/feed/update/{urn.group(0)}', external_id=urn.group(0),
                         published_at=pub_at or added_at, last_error=None))
    elif removed or notion_removed:
        pubs.append(dict(post_id=pid, channel='linkedin', lang='pt', status=li_status, url=None, external_id=None,
                         published_at=pub_at, last_error=None))
    elif status == 'published':
        pubs.append(dict(post_id=pid, channel='linkedin', lang='pt', status='published', url=None, external_id=None,
                         published_at=pub_at, last_error=None))
        issue(f'linkedin_without_urn:{pid}', 'load_linkedin_without_urn', 'warning',
              f'Published in Notion without a LinkedIn URN: {r["Topic"][:120]}', pid, {'publish_notes': notes[:300]},
              'Find the post on LinkedIn and record its URL, or mark it as not published')

    if removed or notion_removed:
        # Published then pulled back: reason and date from the "Removido ..." note in Publish Notes when present.
        note = re.search(r'Removid[oa][^|]*', notes)
        when = re.search(r'em (\d{2})/(\d{2})/(\d{4})', note.group(0)) if note else None
        status = posts[-1]['status'] = 'removed'
        posts[-1]['removal_reason'] = (note.group(0).strip()[:500] if note
                                       else 'Marked Removed in Notion (no reason in Publish Notes)' if notion_removed
                                       else 'Blog article deleted from the repository (no reason recorded)')
        posts[-1]['removed_at'] = f'{when.group(3)}-{when.group(2)}-{when.group(1)}' if when else None
        posts[-1]['discard_reason'] = None
    events.append(dict(post_id=pid, to_status=status, notes=f'initial Notion load (Status={notion_status})'))

    # dedup keys
    url_n = posts[-1]['source_url']
    ks = [('cve', f'cve:{c}') for c in cves(r['Topic'], r.get('Post Text'))]
    if not is_generic(url_n):
        ks.append(('url', f'url:{url_n}'))
    if not ks:
        ks = [('cve', f'cve:{c}') for c in cves(r.get('Briefing MD'))]
    fu_target = FOLLOW_UPS.get(slug or '')
    if fu_target and fu_target in by_slug:
        posts[-1]['follow_up_of'] = by_slug[fu_target]
    for kind, k in ks:
        if k in owner and kind == 'cve' and posts[-1]['follow_up_of'] is None:
            # Same CVE as an earlier post: a continuation of that story (follow-up of the chain's root).
            r0 = owner[k]
            while by_id[r0]['follow_up_of']:
                r0 = by_id[r0]['follow_up_of']
            posts[-1]['follow_up_of'] = r0
        if k in owner:
            fu = posts[-1]['follow_up_of']
            r1 = owner[k]
            while by_id[r1]['follow_up_of']:
                r1 = by_id[r1]['follow_up_of']
            if fu is not None and (owner[k] == fu or r1 == fu):
                continue  # continuation of the same story: the key stays with the original
            issue(f'key_collision:{k}:{pid}', 'load_key_collision', 'warning',
                  f'Key {k} already belongs to post #{owner[k]}; not recorded for #{pid} ({r["Topic"][:80]})', pid,
                  {'key': k, 'owner': owner[k]}, 'Check whether it is a real duplicate or a continuation (follow_up_of)')
            continue
        owner[k] = pid
        keys.append(dict(key=k, post_id=pid, kind=kind))

json.dump(dict(posts=posts, keys=keys, publications=pubs, events=events, issues=issues),
          open(os.path.join(HERE, 'load.json'), 'w'), ensure_ascii=False)

print('posts', len(posts), Counter(p['status'] for p in posts))
print('keys', len(keys), Counter(c['kind'] for c in keys))
print('publications', len(pubs), Counter((p['channel'], p['lang'], p['status']) for p in pubs))
print('follow-ups', [(p['id'], p['slug'], p['follow_up_of']) for p in posts if p['follow_up_of']])
print('without key', [(p['id'], p['topic'][:50]) for p in posts
                      if p['status'] != 'discarded' and p['follow_up_of'] is None and not any(c['post_id'] == p['id'] for c in keys)])
print('load issues', len(issues), Counter(i['kind'] for i in issues))
