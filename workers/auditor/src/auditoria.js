import { ORCAMENTO, REPO } from './constantes.js';
import { checarQuadrados, DIAS_RECENTES } from './quadrado.js';
import { capaValida } from './checagens.js';
import { lerFrontmatter, prefixoDoSlug } from '../../../src/lib/push-catalogo.mjs';
import { lerTexto } from './rede.js';
import { checarBlog, checarCommits, checarNotion, checarPush, criarChecadorCapa } from './checagens.js';
import { calcularAlertas, calcularProblemas, enviarAlertas } from './alertas.js';
import { severidadeSemCapa } from './severidade-capa.js';
import { emBrasilia } from './horario.js';
import { criarRede } from './rede.js';
import { gravarExecucao } from './armazenamento.js';

export async function rodarAuditoria(env, { agora = new Date(), slot = 'manual', fetchImpl = fetch } = {}) {
  const rede = criarRede(fetchImpl, ORCAMENTO);
  const checarCapa = criarChecadorCapa(rede);
  const b = emBrasilia(agora);
  const [blog, github, push] = await Promise.all([
    checarBlog(rede, b.data, checarCapa),
    checarCommits(rede, env.GITHUB_TOKEN),
    checarPush(env),
  ]);
  const notion = await checarNotion(rede, env, b.data, checarCapa);
  const quadrado = await checarQuadrados(rede, env.DSB_AUDITOR, alvosQuadrado(checarCapa.vistas ? checarCapa.vistas() : [], blog, b.data), { capaValida, lerFrontmatter, lerTexto });
  const r = {
    versao: 1,
    em: agora.toISOString(),
    dataBrt: b.data,
    horaBrt: b.hhmm,
    slot,
    flags: { alertas: env.ALERTAS === 'on' ? 'on' : 'off', okDiario: env.ALERTA_OK_DIARIO === 'on' ? 'on' : 'off', notion: env.NOTION === 'on' ? 'on' : 'off' },
    blog,
    github,
    push,
    notion,
    quadrado,
  };
  // Fila sem capa: alerta até passar a rodada de capas do dia útil (ver severidade-capa.js).
  if (notion && notion.ok) for (const c of notion.semCapa || []) c.severidade = severidadeSemCapa(c.entrouEm, agora);
  r.problemas = calcularProblemas(r);
  r.alertas = calcularAlertas(r);
  r.ok = r.problemas.length === 0;
  r.alerta = await enviarAlertas(env, r);
  r.subrequests = { usadas: rede.estado.usadas, orcamento: rede.estado.orcamento, estourou: rede.estado.estourou };
  await gravarExecucao(env.DSB_AUDITOR, r);
  return r;
}

/** Lista para a rotina de capas: itens da fila (Notion) e briefings de hoje sem capa válida. */
export function capasFaltando(r) {
  if (!r) return { ok: false, erro: 'sem_execucao', itens: [] };
  const itens = [];
  for (const c of (r.notion && r.notion.semCapa) || []) itens.push({ origem: 'fila', id: c.id, topic: c.topic, status: c.status, imageUrl: c.imageUrl, motivo: c.motivo, severidade: c.severidade || 'problema' });
  for (const i of (r.blog && r.blog.itens) || []) if (!i.capa.ok) itens.push({ origem: 'blog', slug: i.slug, imageUrl: i.capa.url, motivo: i.capa.motivo });
  return {
    ok: true,
    em: r.em,
    notion: r.notion && r.notion.ativo ? 'on' : 'off',
    truncado: !!((r.notion && r.notion.fila && r.notion.fila.truncado) || (r.blog && r.blog.truncado)),
    total: itens.length,
    itens,
  };
}

/** Fila primeiro (pega a capa antes de publicar), depois blog de hoje, depois publicações dos últimos dias. */
export function alvosQuadrado(vistas, blog, hoje) {
  const fila = vistas.filter((v) => v.origem === 'fila');
  const deHoje = vistas.filter((v) => v.origem === 'blog');
  const jaTem = new Set(deHoje.map((v) => v.slug));
  const limite = new Date(`${hoje}T12:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() - (DIAS_RECENTES - 1));
  const desde = limite.toISOString().slice(0, 10);
  const recentes = ((blog && blog.catalogo) || [])
    .filter((i) => i && i.slug && !jaTem.has(i.slug) && (prefixoDoSlug(i.slug) || '') >= desde && (prefixoDoSlug(i.slug) || '') <= hoje)
    .map((i) => ({ origem: 'blog', slug: i.slug, mdUrl: `https://raw.githubusercontent.com/${REPO}/main/src/content/briefings/${i.slug}.md` }));
  return [...fila, ...deHoje, ...recentes];
}
