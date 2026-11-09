import { ALLOWLIST_PREFIXOS } from './constantes.js';

/** Problemas que merecem aviso ao Marcelo. Pura: só olha o resultado da execução. */
export function calcularProblemas(r) {
  const p = [];
  if (r.blog && r.blog.ok === false && r.blog.erro) p.push(`Blog: catálogo indisponível (${r.blog.status})`);
  for (const i of (r.blog && r.blog.itens) || []) {
    const pg = i.paginas;
    if (pg.pt !== 200 || pg.es !== 200 || pg.en !== 200) p.push(`Blog: ${i.slug} PT ${pg.pt} / ES ${pg.es} / EN ${pg.en}`);
    if (!i.capa.ok) p.push(`Blog: ${i.slug} capa ${i.capa.motivo || 'falhou'}`);
  }
  if (r.push && !r.push.ok) p.push('Push: dsb-push-agenda sem /health');
  if (r.github && r.github.pushEvento && r.github.pushEvento.conclusao === 'failure') p.push(`Action push-evento falhou (${r.github.pushEvento.sha})`);
  const n = r.notion || {};
  if (n.ativo && !n.ok) p.push(`Notion: ${n.erro}`);
  if (n.ativo && n.ok) {
    for (const c of n.semCapa) p.push(`Fila: sem capa — ${c.topic.slice(0, 60)}`);
    for (const u of n.publicadosSemUrn) p.push(`LinkedIn: Publicado sem URN — ${u.topic.slice(0, 60)}`);
    if (r.slot === '08:30' && n.novosHoje.total === 0) p.push('Curadoria: nenhum item adicionado hoje até 08:30');
  }
  return p;
}

/** Só aceita chaves sub:<64 hex> cujo hash começa com um prefixo da allowlist. */
export function filtrarAllowlist(chaves) {
  return (Array.isArray(chaves) ? chaves : []).filter(
    (c) => typeof c === 'string' && /^sub:[0-9a-f]{64}$/.test(c) && ALLOWLIST_PREFIXOS.some((pre) => c.startsWith(`sub:${pre}`)),
  );
}

/**
 * Canal de alerta. Pedaço 1: desligado por padrão (ALERTAS != 'on').
 * O caminho isolado atual do dsb-push-agenda (/admin/tick com `somente`) só envia o aviso de um briefing,
 * não texto livre. O envio real depende de um endpoint dedicado de alerta (próximo pedaço).
 */
export async function enviarAlertas(env, problemas) {
  if (env.ALERTAS !== 'on') return { enviado: false, motivo: 'alertas_off', problemas: problemas.length };
  if (!problemas.length) return { enviado: false, motivo: 'sem_problemas' };
  const destinos = filtrarAllowlist(String(env.ALERTA_SUBS || '').split(',').map((s) => s.trim()));
  if (!destinos.length) return { enviado: false, motivo: 'sem_destino_allowlist' };
  return { enviado: false, motivo: 'endpoint_alerta_pendente', destinos: destinos.length };
}
