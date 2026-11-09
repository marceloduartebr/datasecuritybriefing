// Aba "Leituras" do /painel: analytics do blog a partir do Cloudflare Web Analytics (RUM),
// via GraphQL Analytics API (rumPageloadEventsAdaptiveGroups), filtrando o host do blog.
// - Só leitura. Token CF_ANALYTICS_TOKEN (Account Analytics: Read) + var CF_ACCOUNT_ID.
// - Cache em KV DSB_AUDITOR (chave leituras:v1, 30 min): no máx. 4 subrequests por atualização
//   (1 GraphQL com as 3 janelas + catálogo do blog). Não roda no cron nem mexe em alertas.
// - Números são estimativas: os grupos "Adaptive" são amostrados pela Cloudflare.
import { SITE } from './constantes.js';

export const HOST_BLOG = 'dsb.duarte.top';
export const CHAVE_CACHE = 'leituras:v1';
export const CACHE_MS = 30 * 60 * 1000;
export const JANELAS = [['24h', 1], ['7d', 7], ['30d', 30]];
const GQL = 'https://api.cloudflare.com/client/v4/graphql';

const QUERY = `query($a:String!,$f24:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject,$f7:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject,$f30:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject){viewer{accounts(filter:{accountTag:$a}){
t24:rumPageloadEventsAdaptiveGroups(limit:1,filter:$f24){count sum{visits}}
g24:rumPageloadEventsAdaptiveGroups(limit:5000,filter:$f24){count dimensions{requestPath refererHost}}
t7:rumPageloadEventsAdaptiveGroups(limit:1,filter:$f7){count sum{visits}}
g7:rumPageloadEventsAdaptiveGroups(limit:5000,filter:$f7){count dimensions{requestPath refererHost}}
t30:rumPageloadEventsAdaptiveGroups(limit:1,filter:$f30){count sum{visits}}
g30:rumPageloadEventsAdaptiveGroups(limit:5000,filter:$f30){count dimensions{requestPath refererHost}}
}}}`;

const iso = (d) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

export function filtroJanela(agora, dias) {
  return { AND: [
    { datetime_geq: iso(new Date(agora.getTime() - dias * 86400000)) },
    { datetime_leq: iso(agora) },
    { requestHost: HOST_BLOG },
    { bot: 0 },
  ] };
}

/** /briefings/<slug>, /es/briefings/<slug>/, /en/... → { slug, idioma }. Outras páginas → null. */
export function postDoCaminho(path) {
  const m = /^\/(?:(es|en)\/)?briefings\/([a-z0-9][a-z0-9-]*)\/?$/i.exec(String(path || ''));
  return m ? { slug: m[2].toLowerCase(), idioma: (m[1] || 'pt').toUpperCase() } : null;
}

export const ORIGENS = ['LinkedIn', 'X', 'Google', 'Direto', 'Outros', 'Navegação no blog'];

export function origemDoReferer(host) {
  const h = String(host || '').toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  if (!h) return 'Direto';
  if (h === HOST_BLOG) return 'Navegação no blog';
  if (h === 'linkedin.com' || h.endsWith('.linkedin.com') || h === 'lnkd.in') return 'LinkedIn';
  if (h === 't.co' || h === 'x.com' || h === 'twitter.com' || h.endsWith('.x.com') || h.endsWith('.twitter.com')) return 'X';
  if (/^(.+\.)?google\.[a-z.]+$/.test(h) || h === 'android-app' || h === 'googlequicksearchbox') return 'Google';
  return 'Outros';
}

export const TIPOS = { noticia: 'Notícia', incidente: 'Incidente', vulnerabilidades: 'Vulnerabilidades' };

/** Agrega os grupos de uma janela: ranking por slug (PT/ES/EN juntos), tipo, idioma e origem. */
export function agregar(grupos, catalogo = new Map(), total = null) {
  const posts = new Map();
  const porTipo = {};
  const porIdioma = { PT: 0, ES: 0, EN: 0 };
  const porOrigem = Object.fromEntries(ORIGENS.map((o) => [o, 0]));
  const outrosHosts = {};
  let leiturasPosts = 0;
  let paginas = 0;
  for (const g of grupos || []) {
    const n = Number(g.count) || 0;
    const d = g.dimensions || {};
    paginas += n;
    const post = postDoCaminho(d.requestPath);
    if (!post) continue;
    leiturasPosts += n;
    const info = catalogo.get(post.slug) || {};
    const chave = info.slug || post.slug;
    const p = posts.get(chave) || { slug: chave, titulo: info.titulo || post.slug, tipo: TIPOS[info.tipo] || 'Sem tipo', leituras: 0, idiomas: { PT: 0, ES: 0, EN: 0 } };
    p.leituras += n;
    p.idiomas[post.idioma] = (p.idiomas[post.idioma] || 0) + n;
    posts.set(chave, p);
    porTipo[p.tipo] = (porTipo[p.tipo] || 0) + n;
    porIdioma[post.idioma] = (porIdioma[post.idioma] || 0) + n;
    const o = origemDoReferer(d.refererHost);
    porOrigem[o] += n;
    if (o === 'Outros') {
      const h = String(d.refererHost || '').toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
      outrosHosts[h] = (outrosHosts[h] || 0) + n;
    }
  }
  const ranking = [...posts.values()].sort((a, b) => b.leituras - a.leituras || a.slug.localeCompare(b.slug));
  return {
    paginas: total && Number.isFinite(total.count) ? total.count : paginas,
    visitas: total && Number.isFinite(total.visits) ? total.visits : null,
    leiturasPosts,
    ranking: ranking.slice(0, 15),
    totalPosts: ranking.length,
    porTipo,
    porIdioma,
    porOrigem,
    outrosHosts: Object.entries(outrosHosts).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

/** slug → { titulo, tipo } a partir do catálogo público do blog. */
export function mapaCatalogo(json) {
  const lista = Array.isArray(json) ? json : json && Array.isArray(json.itens) ? json.itens : [];
  const m = new Map();
  for (const i of lista) {
    if (!i || typeof i.slug !== 'string') continue;
    const slug = i.slug.toLowerCase();
    const info = { slug, titulo: String(i.titulo || i.slug).slice(0, 200), tipo: String(i.tipo || '').toLowerCase() };
    m.set(slug, info);
  }
  // Posts com `slug:` no frontmatter também respondem sem o prefixo de data (/briefings/argentina-...):
  // o apelido sem data aponta para o mesmo item, para PT/ES/EN e as duas URLs somarem juntos.
  for (const info of [...m.values()]) {
    const curto = info.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    if (curto !== info.slug && !m.has(curto)) m.set(curto, info);
  }
  return m;
}

/** Consulta a API (sem cache). */
export async function consultarLeituras(env, { agora = new Date(), fetchFn = fetch } = {}) {
  const token = String(env.CF_ANALYTICS_TOKEN || '').trim();
  const conta = String(env.CF_ACCOUNT_ID || '').trim();
  if (!token || !conta) return { ok: false, erro: 'sem_token' };
  const variables = { a: conta, f24: filtroJanela(agora, 1), f7: filtroJanela(agora, 7), f30: filtroJanela(agora, 30) };
  const [rg, rc] = await Promise.all([
    fetchFn(GQL, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ query: QUERY, variables }) }),
    fetchFn(`${SITE}/push/catalogo.json`, { cf: { cacheTtl: 600 } }).catch(() => null),
  ]);
  if (!rg.ok) return { ok: false, erro: `graphql_http_${rg.status}` };
  const j = await rg.json().catch(() => null);
  if (!j || (j.errors && j.errors.length)) return { ok: false, erro: `graphql: ${String(j && j.errors && j.errors[0] && j.errors[0].message || 'resposta inválida').slice(0, 120)}` };
  const acc = j.data && j.data.viewer && j.data.viewer.accounts && j.data.viewer.accounts[0];
  if (!acc) return { ok: false, erro: 'graphql: conta sem dados' };
  const catalogo = mapaCatalogo(rc && rc.ok ? await rc.json().catch(() => null) : null);
  const janelas = {};
  for (const [nome] of JANELAS) {
    const k = nome.replace(/[hd]$/, '');
    const t = (acc[`t${k}`] || [])[0];
    janelas[nome] = agregar(acc[`g${k}`] || [], catalogo, t ? { count: t.count, visits: t.sum && t.sum.visits } : null);
  }
  return { ok: true, geradoEm: agora.toISOString(), janelas };
}

/** Lê do KV; se faltar ou tiver mais de 30 min, consulta e grava. Falha da API devolve o cache antigo, se houver. */
export async function obterLeituras(env, { agora = new Date(), fetchFn = fetch, forcar = false } = {}) {
  const kv = env.DSB_AUDITOR;
  let cache = null;
  try { cache = kv ? await kv.get(CHAVE_CACHE, 'json') : null; } catch { cache = null; }
  if (!forcar && cache && cache.ok && agora.getTime() - Date.parse(cache.geradoEm) < CACHE_MS) return { ...cache, doCache: true };
  let novo;
  try { novo = await consultarLeituras(env, { agora, fetchFn }); } catch (e) { novo = { ok: false, erro: String(e && e.message || e).slice(0, 120) }; }
  if (novo.ok) {
    try { if (kv) await kv.put(CHAVE_CACHE, JSON.stringify(novo), { expirationTtl: 7 * 86400 }); } catch { /* segue sem cache */ }
    return novo;
  }
  if (cache && cache.ok) return { ...cache, doCache: true, aviso: novo.erro };
  return novo;
}
