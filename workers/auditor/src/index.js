import { autorizar } from './auth.js';
import { capasFaltando, rodarAuditoria } from './auditoria.js';
import { lerHistorico, lerUltimo } from './armazenamento.js';
import { slotDoTick } from './horario.js';

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function tratar(request, env, ctx, deps = {}) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';
  if (request.method === 'GET' && path === '/health') return json({ ok: true, servico: 'dsb-auditor' });
  if (!['/status', '/capas-faltando', '/rodar'].includes(path)) return json({ ok: false, erro: 'nao_encontrado' }, 404);
  const auth = await autorizar(request, env);
  if (!auth.ok) return json({ ok: false, erro: auth.erro }, auth.status);

  if (path === '/rodar') {
    if (request.method !== 'POST') return json({ ok: false, erro: 'metodo' }, 405);
    const r = await rodarAuditoria(env, { slot: 'manual', ...deps });
    return json(r);
  }
  if (request.method !== 'GET') return json({ ok: false, erro: 'metodo' }, 405);
  const ultimo = await lerUltimo(env.DSB_AUDITOR);
  if (path === '/status') {
    if (!ultimo) return json({ ok: false, erro: 'sem_execucao' }, 404);
    return json({ ...ultimo, historico: await lerHistorico(env.DSB_AUDITOR) });
  }
  return json(capasFaltando(ultimo), ultimo ? 200 : 404);
}

export default {
  fetch(request, env, ctx) {
    return tratar(request, env, ctx);
  },
  async scheduled(controller, env, ctx) {
    const slot = slotDoTick(controller.scheduledTime);
    if (!slot) return; // tick fora dos horários: sai sem rede nem KV
    ctx.waitUntil(rodarAuditoria(env, { agora: new Date(controller.scheduledTime), slot }));
  },
};
