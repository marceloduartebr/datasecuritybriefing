// Gatilho dos avisos push da fila (dsbq.duarte.top / Worker dsb-fila).
// Reaproveita o cron do auditor (sem cron novo; plano free tem 5): a cada tick chama
// POST /interno/checar-novos no dsb-fila via Service Binding FILA, com o secret FILA_INTERNO_TOKEN.
// Toda a lógica (Notion, dedupe, silêncio 22h–7h, flag FILA_PUSH, inscrições) fica no dsb-fila.
// Isolado do resto: não lê/grava DSB_AUDITOR, não toca ALERTAS nem o painel; falha só gera log.
export async function dispararFilaPush(env) {
  if (!env || !env.FILA || typeof env.FILA.fetch !== 'function' || !env.FILA_INTERNO_TOKEN) return { pulado: 'sem_binding' };
  try {
    const r = await env.FILA.fetch('https://dsb-fila/interno/checar-novos', {
      method: 'POST',
      headers: { 'x-interno-token': String(env.FILA_INTERNO_TOKEN) },
    });
    const corpo = await r.text().catch(() => '');
    console.log(JSON.stringify({ evento: 'fila_push', status: r.status, corpo: corpo.slice(0, 300) }));
    return { status: r.status };
  } catch (e) {
    console.log(JSON.stringify({ evento: 'fila_push_erro', msg: String(e && e.message).slice(0, 200) }));
    return { erro: true };
  }
}
