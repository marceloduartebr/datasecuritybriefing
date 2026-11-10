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
  for (const q of (r.quadrado && r.quadrado.positivas) || []) {
    p.push(`Capa: quadrado escuro atrás do escudo — ${q.origem === 'fila' ? (q.topic || q.id || '').slice(0, 60) : q.slug}`);
  }
  const n = r.notion || {};
  if (n.ativo && !n.ok) p.push(`Notion: ${n.erro}`);
  if (n.ativo && n.ok) {
    for (const c of n.semCapa) p.push(`Fila: sem capa — ${c.topic.slice(0, 60)}`);
    for (const u of n.publicadosSemUrn) p.push(`LinkedIn: Publicado sem URN — ${u.topic.slice(0, 60)}`);
    if (r.slot === '08:30' && n.novosHoje.total === 0) p.push('Curadoria: nenhum item adicionado hoje até 08:30');
  }
  return p;
}

/** Monta o alerta (texto livre curto). null = nada a enviar. */
export function montarAlerta(r, env = {}) {
  const n = r.problemas.length;
  if (n > 0) {
    const linhas = r.problemas.slice(0, 4).map((p) => `• ${p}`);
    if (n > 4) linhas.push(`• +${n - 4} outro(s)`);
    return { titulo: `DSB: ${n} problema(s) às ${r.horaBrt}`, texto: linhas.join('\n').slice(0, 400) };
  }
  if (r.slot === '19:15' && env.ALERTA_OK_DIARIO === 'on') {
    const pub = r.blog ? r.blog.total : 0;
    return { titulo: 'DSB: tudo certo hoje', texto: `${pub} briefing(s) no blog, capas e páginas ok.` };
  }
  return null;
}

function assinatura(alerta) {
  return `${alerta.titulo.replace(/ às \d\d:\d\d$/, '')}|${alerta.texto}`;
}

/**
 * Canal de alerta: POST /admin/alerta do dsb-push-agenda via Service Binding, com ALERTA_TOKEN.
 * Desligado por padrão (ALERTAS != 'on'). Destinos não saem daqui: a allowlist fica no dsb-push-agenda.
 * Não repete o mesmo conjunto de problemas no mesmo dia (KV `alerta:ultimo`).
 */
export async function enviarAlertas(env, r) {
  const alerta = montarAlerta(r, env);
  if (env.ALERTAS !== 'on') return { enviado: false, motivo: 'alertas_off', problemas: r.problemas.length };
  if (!alerta) return { enviado: false, motivo: 'sem_problemas' };
  if (!env.PUSH_AGENDA || typeof env.PUSH_AGENDA.fetch !== 'function') return { enviado: false, motivo: 'sem_binding' };
  if (!env.ALERTA_TOKEN) return { enviado: false, motivo: 'sem_token' };
  const sig = assinatura(alerta);
  const kv = env.DSB_AUDITOR;
  if (kv && r.slot !== 'manual') {
    try {
      const ult = await kv.get('alerta:ultimo', 'json');
      if (ult && ult.data === r.dataBrt && ult.sig === sig) return { enviado: false, motivo: 'repetido' };
    } catch {
      /* segue */
    }
  }
  let res;
  try {
    res = await env.PUSH_AGENDA.fetch('https://dsb-push-agenda/admin/alerta', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.ALERTA_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify(alerta),
    });
  } catch {
    return { enviado: false, motivo: 'rede' };
  }
  let j = null;
  try {
    j = await res.json();
  } catch {
    j = null;
  }
  const enviado = !!(res.ok && j && j.enviados > 0);
  if (enviado && kv) await kv.put('alerta:ultimo', JSON.stringify({ data: r.dataBrt, sig, em: r.em, slot: r.slot, titulo: alerta.titulo, tipo: r.problemas.length ? 'problema' : 'ok_diario' }));
  return { enviado, http: res.status, enviados: j ? j.enviados ?? 0 : 0, destinos: j && Array.isArray(j.destinos) ? j.destinos : [] };
}
