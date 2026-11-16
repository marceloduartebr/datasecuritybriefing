import { ErroApi } from './http.js';

export const STATUS = ['Novo', 'Aprovado', 'Publicado', 'Descartado'];
export const TIPOS = ['Incidente', 'Notícia', 'Vulnerabilidades'];
export const PAISES = ['BR', 'MX', 'AR', 'CL', 'PE', 'PY', 'UY', 'CO', 'US', 'EU', 'LATAM', 'Global'];
export const PRIORIDADES = ['Normal', 'Alta'];
export const IMAGE_SOURCES = ['og', 'generated', 'none'];
export const CANAIS = ['blog', 'linkedin', 'x'];
export const IDIOMAS = ['pt', 'es', 'en'];
export const ADDED_BY = ['user', 'assistant_research', 'Grok_Assistant', 'Claude_Assistant'];
export const CAPAS_PREFIXO = 'https://covers.duarte.top/covers/';

/** Transições manuais de status. "Publicado" só nasce da publicação do blog PT (ver publicacoes.js). */
export const TRANSICOES = {
  Novo: ['Aprovado', 'Descartado'],
  Aprovado: ['Novo', 'Descartado'],
  Descartado: ['Novo'],
  Publicado: []
};

const PARAMS_RASTREIO = /^(utm_.*|fbclid|gclid|mc_cid|mc_eid|ref|ref_src|igshid|si|s)$/i;

/** URL canônica: https/http, host minúsculo, sem fragmento, sem parâmetros de rastreio, sem barra final. */
export function normalizarUrl(bruta, campo = 'source_url') {
  if (typeof bruta !== 'string' || !bruta.trim()) throw new ErroApi(422, 'url_invalida', `${campo} é obrigatório`);
  let u;
  try {
    u = new URL(bruta.trim());
  } catch {
    throw new ErroApi(422, 'url_invalida', `${campo} não é uma URL válida`);
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new ErroApi(422, 'url_invalida', `${campo} deve ser http(s)`);
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  const manter = [...u.searchParams.entries()].filter(([k]) => !PARAMS_RASTREIO.test(k)).sort(([a], [b]) => a.localeCompare(b));
  u.search = '';
  for (const [k, v] of manter) u.searchParams.append(k, v);
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '') || '/';
  return u.toString();
}

export function extrairCves(...textos) {
  const out = new Set();
  for (const t of textos) {
    if (typeof t !== 'string') continue;
    for (const m of t.matchAll(/CVE-\d{4}-\d{4,7}/gi)) out.add(m[0].toUpperCase());
  }
  return [...out];
}

export function validarCves(lista) {
  if (lista == null) return [];
  if (!Array.isArray(lista)) throw new ErroApi(422, 'cves_invalidos', 'cves deve ser uma lista');
  const out = new Set();
  for (const c of lista) {
    const v = String(c || '').trim().toUpperCase();
    if (!/^CVE-\d{4}-\d{4,7}$/.test(v)) throw new ErroApi(422, 'cves_invalidos', `CVE inválido: ${String(c).slice(0, 40)}`);
    out.add(v);
  }
  return [...out];
}

export async function urlGenerica(db, url) {
  const r = await db
    .prepare(
      `SELECT 1 AS g FROM ignored_url_patterns
       WHERE substr(?1, 1, length(prefix)) = prefix AND (contains IS NULL OR instr(?1, contains) > 0) LIMIT 1`
    )
    .bind(url)
    .first();
  return !!r;
}

/** Chaves de assunto do item: cada CVE + a URL normalizada (se não for genérica). */
export async function chavesDoItem(db, { sourceUrl, cves }) {
  const chaves = cves.map((c) => ({ key: `cve:${c}`, kind: 'cve' }));
  const generica = await urlGenerica(db, sourceUrl);
  if (!generica) chaves.push({ key: `url:${sourceUrl}`, kind: 'url' });
  return { chaves, generica };
}

const texto = (v, max, campo, obrigatorio = false) => {
  if (v == null || v === '') {
    if (obrigatorio) throw new ErroApi(422, 'campo_obrigatorio', `${campo} é obrigatório`);
    return null;
  }
  if (typeof v !== 'string') throw new ErroApi(422, 'dado_invalido', `${campo} deve ser texto`);
  const t = v.trim();
  if (obrigatorio && !t) throw new ErroApi(422, 'campo_obrigatorio', `${campo} é obrigatório`);
  if (t.length > max) throw new ErroApi(422, 'dado_invalido', `${campo} passa de ${max} caracteres`);
  return t || null;
};

const umDe = (v, lista, campo, obrigatorio = false, padrao = null) => {
  if (v == null || v === '') {
    if (obrigatorio && padrao == null) throw new ErroApi(422, 'campo_obrigatorio', `${campo} é obrigatório`);
    return padrao;
  }
  if (!lista.includes(v)) throw new ErroApi(422, 'dado_invalido', `${campo} deve ser um de: ${lista.join(', ')}`);
  return v;
};

export function validarSlug(v) {
  const s = texto(v, 120, 'slug');
  if (s && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) throw new ErroApi(422, 'slug_invalido', 'slug deve ser kebab-case sem acento');
  return s;
}

export function validarCapa(imageSource, imageUrl) {
  const src = umDe(imageSource, IMAGE_SOURCES, 'image_source', false, 'none');
  const url = texto(imageUrl, 400, 'image_url');
  if (src === 'none' && url) throw new ErroApi(422, 'capa_incoerente', 'image_source=none não aceita image_url');
  if (src !== 'none' && !url) throw new ErroApi(422, 'capa_incoerente', `image_source=${src} exige image_url`);
  if (url && !url.startsWith(CAPAS_PREFIXO)) throw new ErroApi(422, 'capa_fora_do_host', `image_url deve começar com ${CAPAS_PREFIXO}`);
  return { image_source: src, image_url: url };
}

const isoOuNull = (v, campo) => {
  if (v == null || v === '') return null;
  if (typeof v !== 'string' || Number.isNaN(Date.parse(v))) throw new ErroApi(422, 'data_invalida', `${campo} deve ser data ISO`);
  return v;
};

/** Valida o corpo de criação. O added_by vem do token (agentes) ou do corpo (apps/usuário). */
export function validarNovoPost(b, sessao) {
  const addedBy = sessao.agente === 'user' ? umDe(b.added_by, ADDED_BY, 'added_by', false, 'user') : sessao.agente;
  return {
    topic: texto(b.topic, 300, 'topic', true),
    tipo: umDe(b.tipo, TIPOS, 'tipo', true),
    pais: umDe(b.pais, PAISES, 'pais'),
    priority: umDe(b.priority, PRIORIDADES, 'priority', false, 'Normal'),
    source_name: texto(b.source_name, 200, 'source_name'),
    source_url: normalizarUrl(b.source_url),
    slug: validarSlug(b.slug),
    briefing_md: texto(b.briefing_md, 60000, 'briefing_md'),
    post_text: texto(b.post_text, 3000, 'post_text'),
    ...validarCapa(b.image_source, b.image_url),
    added_by: addedBy,
    added_at: isoOuNull(b.added_at, 'added_at') || new Date().toISOString(),
    follow_up_of: b.follow_up_of == null ? null : Number(b.follow_up_of),
    notion_id: texto(b.notion_id, 40, 'notion_id'),
    cves: validarCves(b.cves)
  };
}

/** Campos editáveis depois da criação (status e source_url ficam de fora). */
export const EDITAVEIS = {
  topic: (v) => texto(v, 300, 'topic', true),
  pais: (v) => umDe(v, PAISES, 'pais'),
  tipo: (v) => umDe(v, TIPOS, 'tipo', true),
  priority: (v) => umDe(v, PRIORIDADES, 'priority', true),
  item_order: (v) => {
    if (v == null) return null;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new ErroApi(422, 'dado_invalido', 'item_order deve ser número');
    return n;
  },
  source_name: (v) => texto(v, 200, 'source_name'),
  slug: validarSlug,
  briefing_md: (v) => texto(v, 60000, 'briefing_md'),
  post_text: (v) => texto(v, 3000, 'post_text')
};
