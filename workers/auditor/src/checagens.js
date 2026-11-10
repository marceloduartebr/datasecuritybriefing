import { lerFrontmatter, normalizarItens, prefixoDoSlug } from '../../../src/lib/push-catalogo.mjs';
import {
  CAPAS_HOST, NOTION_DS, NOTION_VERSAO, REPO, SITE, TETO_CAPAS_FILA, TETO_SLUGS_BLOG,
} from './constantes.js';
import { inicioDoDiaBrt } from './horario.js';
import { lerJson, lerTexto } from './rede.js';

/** Capa aceita: https://covers.duarte.top/covers/<arquivo>.(jpg|jpeg|png|webp) */
export function capaValida(url) {
  if (typeof url !== 'string' || !url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname === CAPAS_HOST && /^\/covers\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

export function urlsIdiomas(slug) {
  return {
    pt: `${SITE}/briefings/${slug}/`,
    es: `${SITE}/es/briefings/${slug}/`,
    en: `${SITE}/en/briefings/${slug}/`,
  };
}

async function headOk(rede, url) {
  const res = await rede.pedir(url, { method: 'HEAD', redirect: 'manual' });
  return { ok: res.status === 200, status: res.status || 0, etag: (res.headers && res.headers.get && res.headers.get('etag')) || null };
}

/** Cache por execução para não repetir HEAD da mesma capa. */
export function criarChecadorCapa(rede) {
  const cache = new Map();
  const vistas = []; // capas que passaram no HEAD, com quem as usa (para a checagem do quadrado escuro)
  const checar = async (url, rotulo) => {
    if (!capaValida(url)) return { ok: false, status: 0, motivo: url ? 'host_invalido' : 'sem_capa' };
    if (!cache.has(url)) cache.set(url, headOk(rede, url).then(({ etag, ...r }) => ({ ...r, motivo: r.ok ? null : 'http', etag })));
    const { etag, ...r } = await cache.get(url);
    if (r.ok && rotulo) vistas.push({ url, versao: etag, ...rotulo });
    return r;
  };
  checar.vistas = () => vistas.slice();
  return checar;
}

/** Briefings de hoje no blog: catálogo público + HEAD PT/ES/EN + capa do frontmatter (GitHub raw). */
export async function checarBlog(rede, hoje, checarCapa) {
  const res = await rede.pedir(`${SITE}/push/catalogo.json`, { cache: 'no-store' });
  if (!res.ok) return { ok: false, erro: 'catalogo', status: res.status || 0, itens: [] };
  const cat = normalizarItens(await lerJson(res));
  const deHoje = (cat.itens || []).filter((i) => prefixoDoSlug(i.slug) === hoje);
  const alvo = deHoje.slice(0, TETO_SLUGS_BLOG);
  const itens = await Promise.all(alvo.map(async (item) => {
    const urls = urlsIdiomas(item.slug);
    const [pt, es, en, md] = await Promise.all([
      headOk(rede, urls.pt), headOk(rede, urls.es), headOk(rede, urls.en),
      rede.pedir(`https://raw.githubusercontent.com/${REPO}/main/src/content/briefings/${item.slug}.md`),
    ]);
    const fm = md.ok ? lerFrontmatter(await lerTexto(md)) : null;
    const cover = fm && fm.cover ? fm.cover : null;
    const capa = await checarCapa(cover, { origem: 'blog', slug: item.slug });
    return {
      slug: item.slug,
      titulo: item.titulo,
      tipo: item.tipo || null,
      paginas: { pt: pt.status, es: es.status, en: en.status },
      capa: { url: cover, ok: capa.ok, status: capa.status, motivo: capa.motivo },
      ok: pt.ok && es.ok && en.ok && capa.ok,
    };
  }));
  const ret = {
    ok: itens.every((i) => i.ok),
    total: deHoje.length,
    checados: itens.length,
    truncado: deHoje.length > alvo.length,
    itens,
  };
  // Slugs dos últimos dias (fora do JSON do /status): alvo da checagem do quadrado escuro.
  Object.defineProperty(ret, 'catalogo', { value: cat.itens || [], enumerable: false });
  return ret;
}

/** Extrai até 5 commits do feed Atom público do GitHub (sem API, sem token). */
export function commitsDoAtom(xml) {
  const out = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = re.exec(String(xml))) && out.length < 5) {
    const e = m[1];
    const id = /Commit\/([0-9a-f]{7,40})/.exec(e);
    const titulo = /<title>([\s\S]*?)<\/title>/.exec(e);
    const em = /<updated>([^<]+)<\/updated>/.exec(e);
    out.push({
      sha: id ? id[1].slice(0, 7) : '',
      mensagem: titulo ? titulo[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").slice(0, 120) : '',
      em: em ? em[1] : null,
    });
  }
  return out;
}

export async function checarCommits(rede, token) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const [c, r] = await Promise.all([
    rede.pedir(`https://api.github.com/repos/${REPO}/commits?sha=main&per_page=5`, { headers }),
    rede.pedir(`https://api.github.com/repos/${REPO}/actions/workflows/push-evento.yml/runs?branch=main&per_page=1`, { headers }),
  ]);
  const out = { ok: false, commits: [], pushEvento: null };
  if (c.ok) {
    const lista = (await lerJson(c)) || [];
    out.commits = (Array.isArray(lista) ? lista : []).map((x) => ({
      sha: String(x.sha || '').slice(0, 7),
      mensagem: String((x.commit && x.commit.message) || '').split('\n')[0].slice(0, 120),
      em: (x.commit && x.commit.committer && x.commit.committer.date) || null,
    }));
    out.ok = true;
  } else {
    out.erro = `commits_http_${c.status || 0}`;
    const atom = await rede.pedir(`https://github.com/${REPO}/commits/main.atom`);
    if (atom.ok) {
      out.commits = commitsDoAtom(await lerTexto(atom));
      out.ok = out.commits.length > 0;
      out.fonte = 'atom';
    }
  }
  if (r.ok) {
    const j = await lerJson(r);
    const run = j && Array.isArray(j.workflow_runs) ? j.workflow_runs[0] : null;
    if (run) {
      out.pushEvento = {
        status: run.status, conclusao: run.conclusion, sha: String(run.head_sha || '').slice(0, 7), em: run.created_at,
      };
    }
  }
  return out;
}

/**
 * Push: /health via Service Binding (workers.dev → workers.dev da mesma conta dá 404 por fetch).
 * /admin/status só se PUSH_ADMIN_TOKEN existir (não configurado no pedaço 1).
 */
export async function checarPush(env) {
  const svc = env.PUSH_AGENDA;
  if (!svc || typeof svc.fetch !== 'function') return { ok: false, health: 0, erro: 'sem_binding', status: null };
  let health = 0;
  let saude = null;
  try {
    const h = await svc.fetch('https://dsb-push-agenda/health');
    health = h.status;
    saude = h.ok ? await lerJson(h) : null;
  } catch {
    health = 0;
  }
  const out = { ok: !!(saude && saude.ok), health, status: null };
  if (env.PUSH_ADMIN_TOKEN) {
    try {
      const s = await svc.fetch('https://dsb-push-agenda/admin/status', { headers: { Authorization: `Bearer ${env.PUSH_ADMIN_TOKEN}` } });
      const j = s.ok ? await lerJson(s) : null;
      if (j) {
        const artigos = (j.artigos || []).slice(-10).map((a) => ({ slug: a.slug, status: a.status, entregas: a.entregas || {} }));
        out.status = { envio: j.envio || null, fanout: j.fanout || null, pushEnvio: j.pushEnvio || null, artigos };
      }
    } catch {
      /* status indisponível */
    }
  }
  return out;
}

// ---------- Notion (atrás de NOTION=on) ----------

function texto(prop) {
  if (!prop) return '';
  const arr = prop.title || prop.rich_text || [];
  return arr.map((t) => t.plain_text || (t.text && t.text.content) || '').join('');
}

export function resumirPagina(p) {
  const pr = p.properties || {};
  return {
    id: String(p.id || '').replace(/-/g, ''),
    topic: texto(pr.Topic).slice(0, 160),
    status: pr.Status && pr.Status.select ? pr.Status.select.name : null,
    tipo: pr.Tipo && pr.Tipo.select ? pr.Tipo.select.name : null,
    imageUrl: pr['Image URL'] ? pr['Image URL'].url : null,
    temUrn: /urn:li:/i.test(texto(pr['Publish Notes'])),
    // Publicado só no blog (sem LinkedIn): marcador 'Somente blog' / 'somente-blog' no Publish Notes.
    somenteBlog: /somente[\s-]+blog/i.test(texto(pr['Publish Notes'])),
  };
}

async function consultar(rede, token, filtro, props) {
  const qs = props.map((p) => `filter_properties[]=${encodeURIComponent(p)}`).join('&');
  const res = await rede.pedir(`https://api.notion.com/v1/data_sources/${NOTION_DS}/query?${qs}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSAO, 'content-type': 'application/json' },
    body: JSON.stringify({ page_size: 50, filter: filtro }),
  });
  if (!res.ok) return { erro: `notion_http_${res.status || 0}` };
  const j = await lerJson(res);
  return { paginas: (j && j.results ? j.results : []).map(resumirPagina), mais: !!(j && j.has_more) };
}

export async function checarNotion(rede, env, hoje, checarCapa) {
  if (env.NOTION !== 'on') return { ativo: false };
  if (!env.NOTION_TOKEN) return { ativo: true, ok: false, erro: 'sem_token' };
  const tok = env.NOTION_TOKEN;
  const desde = inicioDoDiaBrt(hoje);
  const [novos, fila, publicados] = await Promise.all([
    // Saída da curadoria de hoje, em qualquer Status (o Marcelo pode já ter aprovado/descartado).
    consultar(rede, tok, { property: 'Added At', date: { on_or_after: desde } }, ['Topic', 'Status', 'Tipo']),
    consultar(rede, tok, { or: [
      { property: 'Status', select: { equals: 'Aprovado' } },
      { property: 'Status', select: { equals: 'Novo' } },
    ] }, ['Topic', 'Status', 'Tipo', 'Image URL']),
    consultar(rede, tok, { and: [
      { property: 'Status', select: { equals: 'Publicado' } },
      { property: 'Published At', date: { on_or_after: desde } },
    ] }, ['Topic', 'Status', 'Tipo', 'Publish Notes']),
  ]);
  const erros = [novos, fila, publicados].map((r) => r.erro).filter(Boolean);
  if (erros.length) return { ativo: true, ok: false, erro: erros[0] };

  const porTipo = {};
  for (const p of fila.paginas) {
    if (p.status !== 'Aprovado') continue;
    porTipo[p.tipo || 'sem_tipo'] = (porTipo[p.tipo || 'sem_tipo'] || 0) + 1;
  }
  const alvo = fila.paginas.slice(0, TETO_CAPAS_FILA);
  const semCapa = [];
  for (const p of alvo) {
    const r = await checarCapa(p.imageUrl, { origem: 'fila', id: p.id, topic: p.topic });
    if (!r.ok) semCapa.push({ id: p.id, topic: p.topic, status: p.status, imageUrl: p.imageUrl, motivo: r.motivo, http: r.status });
  }
  const semUrn = publicados.paginas.filter((p) => !p.temUrn && !p.somenteBlog).map((p) => ({ id: p.id, topic: p.topic, tipo: p.tipo }));
  return {
    ativo: true,
    ok: true,
    novosHoje: {
      total: novos.paginas.length,
      aindaNovo: novos.paginas.filter((p) => p.status === 'Novo').length,
      itens: novos.paginas.map((p) => ({ id: p.id, topic: p.topic, tipo: p.tipo, status: p.status })),
    },
    aprovadosPorTipo: porTipo,
    fila: { total: fila.paginas.length, capasChecadas: alvo.length, truncado: fila.paginas.length > alvo.length || fila.mais },
    semCapa,
    publicadosHoje: publicados.paginas.length,
    publicadosSemUrn: semUrn,
  };
}
