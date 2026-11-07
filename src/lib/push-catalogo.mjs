/**
 * Catálogo público de briefings para o agendador de Web Push.
 * Lê o frontmatter bruto: o schema do Astro preenche `tipo` com "incidente"
 * quando o campo falta, e isso mudaria título e filtro. Aqui, ausência permanece ausência.
 * Não inclui corpo, notionUrl, sourceUrl, cover nem outros campos internos.
 */

export const FUSO = 'America/Sao_Paulo';
export const TIPOS = ['noticia', 'vulnerabilidades', 'incidente'];
const CHAVES = ['slug', 'titulo', 'url', 'data', 'tipo', 'pais', 'publicadoEm'];

export function dataBrasilia(instante) {
  const data = instante instanceof Date ? instante : new Date(instante);
  if (Number.isNaN(data.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(data);
}

/** Igual ao bot: o dia do push é o prefixo YYYY-MM-DD do nome do arquivo, não o calendário do pubDate. */
export function prefixoDoSlug(slug) {
  const m = /^(\d{4}-\d{2}-\d{2})-/.exec(slug || '');
  return m ? m[1] : null;
}

/**
 * Candidatos de hoje pelo prefixo do slug. `futuros` têm o prefixo de hoje,
 * mas o instante de pubDate ainda não chegou e não podem sair.
 */
export function selecionarDoDia(itens, agora) {
  const agoraData = agora instanceof Date ? agora : new Date(agora);
  const hoje = dataBrasilia(agoraData);
  const agoraMs = agoraData.getTime();
  const prontos = [];
  const futuros = [];
  if (!hoje || !Array.isArray(itens)) return { hoje, prontos, futuros };
  for (const item of itens) {
    if (!item || prefixoDoSlug(item.slug) !== hoje) continue;
    if (Date.parse(item.publicadoEm) > agoraMs) futuros.push(item);
    else prontos.push(item);
  }
  return { hoje, prontos, futuros };
}

function desquote(valor) {
  const s = String(valor).trim();
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) return s.slice(1, -1);
  return s;
}

export function lerFrontmatter(markdown) {
  const texto = String(markdown).replace(/^\uFEFF/, '');
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const campos = {};
  for (const linha of fm.split(/\r?\n/)) {
    const kv = linha.match(/^([A-Za-z0-9]+):\s*(.*)$/);
    if (!kv) continue;
    campos[kv[1]] = desquote(kv[2]);
  }
  return campos;
}

function slugValido(slug) {
  return typeof slug === 'string' && slug.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function tipoValido(tipo) {
  return TIPOS.includes(tipo) ? tipo : undefined;
}

/** Mesma regra do script atual: token minúsculo passa; inválido some (não restringe). */
function paisPreservado(pais) {
  if (typeof pais !== 'string') return undefined;
  const s = pais.trim();
  if (!/^[a-z]{2,32}$/.test(s)) return undefined;
  return s;
}

export function itemDeArquivo(slug, markdown, agora) {
  if (!slugValido(slug)) return { excluir: 'slug' };
  const fm = lerFrontmatter(markdown);
  if (!fm) return { excluir: 'sem_frontmatter' };
  const titulo = fm.title;
  if (!titulo || titulo.length > 300) return { excluir: 'titulo' };
  const publicado = new Date(fm.pubDate);
  if (!fm.pubDate || Number.isNaN(publicado.getTime())) return { excluir: 'pubDate' };
  const data = prefixoDoSlug(slug);
  if (!data) return { excluir: 'sem_prefixo' };
  // `agora` fica na assinatura para o bloqueio de futuro na seleção, não para omitir o item.
  void agora;
  const item = {
    slug,
    titulo,
    url: `/briefings/${slug}`,
    data,
    publicadoEm: publicado.toISOString(),
  };
  const tipo = tipoValido(fm.tipo);
  const pais = paisPreservado(fm.pais);
  if (tipo) item.tipo = tipo;
  if (pais) item.pais = pais;
  return { item };
}

export function gerarCatalogo(arquivos, agora) {
  const itens = [];
  const excluidos = [];
  for (const arquivo of arquivos) {
    const r = itemDeArquivo(arquivo.slug, arquivo.markdown, agora);
    if (r.item) itens.push(r.item);
    else excluidos.push({ slug: String(arquivo.slug), motivo: r.excluir || 'invalido' });
  }
  itens.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : a.slug < b.slug ? -1 : 1));
  return { itens, excluidos };
}

export function normalizarItem(bruto) {
  if (!bruto || typeof bruto !== 'object') return null;
  if (!slugValido(bruto.slug)) return null;
  if (typeof bruto.titulo !== 'string' || !bruto.titulo || bruto.titulo.length > 300) return null;
  if (bruto.url !== `/briefings/${bruto.slug}`) return null;
  const data = prefixoDoSlug(bruto.slug);
  if (!data) return null;
  if (bruto.data !== undefined && bruto.data !== data) return null;
  const publicado = new Date(bruto.publicadoEm);
  if (Number.isNaN(publicado.getTime())) return null;
  const item = {
    slug: bruto.slug,
    titulo: bruto.titulo,
    url: bruto.url,
    data,
    publicadoEm: publicado.toISOString(),
  };
  const tipo = tipoValido(bruto.tipo);
  const pais = paisPreservado(bruto.pais);
  if (tipo) item.tipo = tipo;
  if (pais) item.pais = pais;
  return item;
}

/** Descarta campos desconhecidos (notion, fonte, chaves) mesmo se o JSON publicado crescer. */
export function normalizarItens(entrada) {
  const lista = Array.isArray(entrada) ? entrada : entrada && entrada.itens;
  if (!Array.isArray(lista)) return { itens: [], erro: 'formato' };
  const vistos = new Set();
  const itens = [];
  for (const bruto of lista) {
    const item = normalizarItem(bruto);
    if (!item || vistos.has(item.slug)) continue;
    vistos.add(item.slug);
    for (const chave of Object.keys(item)) {
      if (!CHAVES.includes(chave)) delete item[chave];
    }
    itens.push(item);
  }
  return { itens };
}
