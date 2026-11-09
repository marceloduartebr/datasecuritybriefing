import { ORCAMENTO } from './constantes.js';
import { checarBlog, checarCommits, checarNotion, checarPush, criarChecadorCapa } from './checagens.js';
import { calcularProblemas, enviarAlertas } from './alertas.js';
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
  const r = {
    versao: 1,
    em: agora.toISOString(),
    dataBrt: b.data,
    horaBrt: b.hhmm,
    slot,
    flags: { alertas: env.ALERTAS === 'on' ? 'on' : 'off', notion: env.NOTION === 'on' ? 'on' : 'off' },
    blog,
    github,
    push,
    notion,
  };
  r.problemas = calcularProblemas(r);
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
  for (const c of (r.notion && r.notion.semCapa) || []) itens.push({ origem: 'fila', id: c.id, topic: c.topic, status: c.status, imageUrl: c.imageUrl, motivo: c.motivo });
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
