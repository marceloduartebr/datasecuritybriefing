"""Transforma a fila do Notion (notion.json) no schema v2 do D1 (carga.json).

Regras (decisões de 16/11/2026):
- Status no D1 é editorial: Publicado = blog PT publicado (ou pulado).
- Notion "Publicado" + Blog URL com arquivo no repo -> blog pt/es/en publicado.
- Blog URL sem arquivo no repo -> blog pulado (removido do site); "linkedin-only" -> blog pulado.
- URN do LinkedIn em Publish Notes -> publicação linkedin publicada; sem URN -> publicada sem URL + pendência.
- Chaves: CVEs (Topic + Post Text; Briefing MD só se não houver outra chave) e URL normalizada se não for genérica.
- Colisão de chave: Hospital Clínico U. Chile -> follow_up_of; demais -> chave fica com o mais antigo + pendência.
- Nada é descartado em silêncio: todo caso especial vira pendência (source=agente, stage=carga).
"""
import json, os, re, sys
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get('DSB_CONTENT') or os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'src', 'content'))
SITE = 'https://dsb.duarte.top'
GENERICAS = [
    ('https://www.cisa.gov/known-exploited-vulnerabilities-catalog', None),
    ('https://www.cisa.gov/news-events/alerts/', '/cisa-adds-'),
]
FOLLOW_UPS = {'hospital-clinico-uchile-imagenologia': 'hospital-clinico-uchile-imagem'}
RASTREIO = re.compile(r'^(utm_.*|fbclid|gclid|mc_cid|mc_eid|ref|ref_src|igshid|si|s)$', re.I)
ATOR = 'carga-notion'

ENTRADA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AQUI, 'notion.json')
rows = json.load(open(ENTRADA))
arquivos = {l: set(os.listdir(f'{REPO}/{d}')) for l, d in (('pt', 'briefings'), ('es', 'briefings-es'), ('en', 'briefings-en'))}


def norm_url(u):
    p = urlsplit(u.strip())
    q = sorted((k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if not RASTREIO.match(k))
    path = p.path.rstrip('/') or '/'
    return urlunsplit((p.scheme, p.hostname.lower() + (f':{p.port}' if p.port else ''), path, urlencode(q), ''))


def generica(u):
    return any(u.startswith(pre) and (c is None or c in u) for pre, c in GENERICAS)


def cves(*textos):
    out = []
    for t in textos:
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
    m = re.search(r'([0-9a-f]{32})', url.replace('-', ''))
    return m.group(1) if m else None


issues = []


def pendencia(fp, kind, sev, summary, post_id=None, detail=None, acao=None):
    issues.append(dict(fingerprint=f'agente:carga:{fp}', source='agente', kind=kind, severity=sev, stage='carga',
                       post_id=post_id, agent='Claude_Assistant', summary=summary[:500],
                       detail=json.dumps(detail, ensure_ascii=False) if detail else None, suggested_action=acao))


# ordem cronológica para ids estáveis e para a regra "a chave fica com o mais antigo"
rows.sort(key=lambda r: (iso(r.get('date:Added At:start')) or r['createdTime'], r['url']))

posts, chaves, pubs, eventos = [], [], [], []
dono = {}          # chave -> post_id
por_slug = {}      # slug -> post_id
slugs_usados = set()

for i, r in enumerate(rows, start=1):
    pid = i
    status_n = r['Status']
    blog = (r.get('Blog URL') or '').strip()
    notas = r.get('Publish Notes') or ''
    pub_at = iso(r.get('date:Published At:start'))
    added_at = iso(r.get('date:Added At:start')) or r['createdTime']

    # slug: propriedade; senão, do Blog URL (sem a data); repetido -> vem do Blog URL
    slug = (r.get('Slug') or '').strip() or None
    m = re.match(r'^https://dsb\.duarte\.top/briefings/(?:(\d{4}-\d{2}-\d{2})-)?([a-z0-9-]+)/?$', blog)
    slug_blog = m.group(2) if m else None
    if not slug and slug_blog:
        slug = slug_blog
        pendencia(f'slug_do_blog:{pid}', 'carga_slug_derivado', 'info', f'Slug vazio no Notion; derivado do Blog URL: {slug}', pid)
    if slug and slug in slugs_usados:
        alternativo = slug_blog if slug_blog and slug_blog not in slugs_usados else f'{slug}-{pid}'
        pendencia(f'slug_repetido:{pid}', 'carga_slug_repetido', 'aviso',
                  f'Slug "{slug}" repetido no Notion; este item ficou com "{alternativo}"', pid,
                  {'slug_notion': slug, 'slug_d1': alternativo, 'topic': r['Topic']}, 'Conferir qual slug corresponde ao arquivo do blog')
        slug = alternativo
    if slug:
        slugs_usados.add(slug)
        por_slug[slug] = pid

    # status editorial
    blog_publicado = blog and blog != 'linkedin-only'
    if status_n == 'Publicado':
        status = 'Publicado'
    elif status_n == 'Aprovado':
        status = 'Aprovado'
    elif status_n == 'Descartado':
        status = 'Descartado'
    else:
        status = 'Novo'

    if status_n == 'Publicado' and not pub_at:
        pub_at = iso(r.get('date:Approved At:start')) or added_at
        pendencia(f'sem_published_at:{pid}', 'carga_data_ausente', 'info', 'Publicado sem Published At no Notion; usada a data de aprovação/entrada', pid)

    img_src = r.get('Image Source') or 'none'
    img_url = r.get('Image URL') or None
    if img_src == 'none':
        img_url = None

    discard = None
    if status == 'Descartado':
        discard = f"Importado do Notion: {(r.get('Approval Notes') or 'sem motivo registrado')[:400]}"

    posts.append(dict(
        id=pid, notion_id=notion_id(r['url']), topic=r['Topic'], status=status, tipo=r['Tipo'], pais=r.get('Pais') or None,
        priority=r.get('Priority') or 'Normal', item_order=r.get('Order'), source_name=r.get('Source Name') or None,
        source_url=norm_url(r['Source URL']), slug=slug, briefing_md=r.get('Briefing MD') or None,
        post_text=r.get('Post Text') or None, image_source=img_src, image_url=img_url,
        added_by=r.get('Added By') or 'user', added_at=added_at, approved_at=iso(r.get('date:Approved At:start')),
        approval_notes=r.get('Approval Notes') or None, discard_reason=discard, follow_up_of=None))
    if not r.get('Pais'):
        pendencia(f'sem_pais:{pid}', 'carga_pais_ausente', 'info', f'Item sem País no Notion: {r["Topic"][:120]}', pid, acao='Definir o País do item')

    # publicações do blog
    if blog == 'linkedin-only':
        pubs.append(dict(post_id=pid, channel='blog', lang='pt', status='pulado', url=None, external_id=None, published_at=None,
                         last_error='linkedin-only: promoção do próprio blog, sem página'))
    elif blog_publicado:
        arq = f'{blog.rstrip("/").split("/")[-1]}.md'
        if not m or not m.group(1):
            pendencia(f'blog_url_sem_data:{pid}', 'carga_blog_url_fora_do_padrao', 'aviso',
                      f'Blog URL sem a data no caminho: {blog}', pid, acao='Corrigir para https://dsb.duarte.top/briefings/AAAA-MM-DD-slug')
            cand = [f for f in arquivos['pt'] if f.endswith(f'-{slug_blog}.md')] if slug_blog else []
            arq = cand[0] if len(cand) == 1 else arq
        if arq in arquivos['pt']:
            base = arq[:-3]
            pubs.append(dict(post_id=pid, channel='blog', lang='pt', status='publicado', url=f'{SITE}/briefings/{base}', external_id=None,
                             published_at=pub_at, last_error=None))
            for l in ('es', 'en'):
                if arq in arquivos[l]:
                    pubs.append(dict(post_id=pid, channel='blog', lang=l, status='publicado', url=f'{SITE}/{l}/briefings/{base}',
                                     external_id=None, published_at=pub_at, last_error=None))
        else:
            pubs.append(dict(post_id=pid, channel='blog', lang='pt', status='pulado', url=blog, external_id=None, published_at=None,
                             last_error='Página não existe mais no repositório do blog (removida)'))
            pendencia(f'blog_removido:{pid}', 'carga_blog_removido', 'aviso',
                      f'Blog URL aponta para artigo que não existe no repositório: {r["Topic"][:120]}', pid, {'blog_url': blog},
                      'Confirmar se a remoção foi intencional (ex.: regra de concorrentes)')

    # LinkedIn (Publicado no Notion = saiu no LinkedIn)
    urn = re.search(r'urn:li:(?:share|ugcPost|activity):[0-9A-Za-z]+', notas)
    if urn:
        pubs.append(dict(post_id=pid, channel='linkedin', lang='pt', status='publicado',
                         url=f'https://www.linkedin.com/feed/update/{urn.group(0)}', external_id=urn.group(0),
                         published_at=pub_at or added_at, last_error=None))
    elif status_n == 'Publicado':
        pubs.append(dict(post_id=pid, channel='linkedin', lang='pt', status='publicado', url=None, external_id=None,
                         published_at=pub_at, last_error=None))
        pendencia(f'linkedin_sem_urn:{pid}', 'carga_linkedin_sem_urn', 'aviso',
                  f'Publicado no Notion sem URN do LinkedIn: {r["Topic"][:120]}', pid, {'publish_notes': notas[:300]},
                  'Localizar o post no LinkedIn e registrar a URL, ou marcar como não publicado')

    eventos.append(dict(post_id=pid, to_status=status, notes=f'carga inicial do Notion (Status={status_n})'))

    # chaves de dedup
    lista = cves(r['Topic'], r.get('Post Text'))
    url_n = posts[-1]['source_url']
    ks = [('cve', f'cve:{c}') for c in lista]
    if not generica(url_n):
        ks.append(('url', f'url:{url_n}'))
    if not ks:
        extra = cves(r.get('Briefing MD'))
        ks = [('cve', f'cve:{c}') for c in extra]
    alvo_fu = FOLLOW_UPS.get(slug or '')
    if alvo_fu and alvo_fu in por_slug:
        posts[-1]['follow_up_of'] = por_slug[alvo_fu]
    for kind, k in ks:
        if k in dono:
            fu = posts[-1]['follow_up_of']
            if fu is not None and dono[k] == fu:
                continue  # continuação da mesma história: chave fica com o original
            pendencia(f'colisao:{k}:{pid}', 'carga_colisao_chave', 'aviso',
                      f'Chave {k} já pertence ao item #{dono[k]}; não registrada para #{pid} ({r["Topic"][:80]})', pid,
                      {'chave': k, 'dono': dono[k]}, 'Conferir se é duplicata real ou continuação (follow_up_of)')
            continue
        dono[k] = pid
        chaves.append(dict(key=k, post_id=pid, kind=kind))

carga = dict(posts=posts, chaves=chaves, publicacoes=pubs, eventos=eventos, pendencias=issues)
json.dump(carga, open(os.path.join(AQUI, 'carga.json'), 'w'), ensure_ascii=False)

from collections import Counter
print('posts', len(posts), Counter(p['status'] for p in posts))
print('chaves', len(chaves), Counter(c['kind'] for c in chaves))
print('publicações', len(pubs), Counter((p['channel'], p['lang'], p['status']) for p in pubs))
print('follow-ups', [(p['id'], p['slug'], p['follow_up_of']) for p in posts if p['follow_up_of']])
print('sem chave', [(p['id'], p['topic'][:50]) for p in posts if p['status'] != 'Descartado' and p['follow_up_of'] is None and not any(c['post_id'] == p['id'] for c in chaves)])
print('pendências de carga', len(issues), Counter(i['kind'] for i in issues))
