import { autorizar, autorizarPainel } from './auth.js';
import { capasFaltando, rodarAuditoria } from './auditoria.js';
import { lerHistorico, lerUltimo, lerUltimoAlerta } from './armazenamento.js';
import { slotDoTick } from './horario.js';
import { renderPainel, renderLeituras } from './painel.js';
import { obterLeituras } from './leituras.js';
import { SITE } from './constantes.js';

export const HOST_ATALHO = 'dsba.duarte.top';
export const HOST_PAINEL = 'dsb-auditor.duarte.top';
import { dispararFilaPush } from './fila-push.js';
import { usesApi, resolveIssue } from './fila-api.js';
import { ERRO_EN } from './i18n.js';

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

export const ICONES_PAINEL = '/pwa/dsba';
const TIPOS_ICONE = { png: 'image/png', svg: 'image/svg+xml', ico: 'image/x-icon' };

async function iconeEstatico(request, env) {
  if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') return json({ ok: false, erro: 'nao_encontrado' }, 404);
  const res = await env.ASSETS.fetch(request);
  // A browser revalidating its cached icon (If-None-Match) gets 304 from ASSETS: pass it on, it is not a miss.
  if (res.status === 304) {
    const h = new Headers(res.headers);
    h.set('Cache-Control', 'public, max-age=86400');
    return new Response(null, { status: 304, headers: h });
  }
  if (!res.ok) return json({ ok: false, erro: 'nao_encontrado' }, 404);
  const ext = new URL(request.url).pathname.split('.').pop();
  const headers = new Headers(res.headers);
  headers.set('Content-Type', TIPOS_ICONE[ext] || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=86400');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(request.method === 'HEAD' ? null : res.body, { status: 200, headers });
}

/** STG panel action: resolve/ignore an issue through dsb-api-stg, then back to the panel with a fresh sweep. */
async function resolverIssue(request, env, url) {
  const auth = await autorizarPainel(request, env);
  if (!auth.ok || auth.via !== 'access') return json({ ok: false, erro: auth.erro || 'nao_autorizado' }, auth.status || 401);
  const origin = request.headers.get('Origin') || '';
  if (origin !== `https://${url.host}`) return json({ ok: false, erro: 'origem' }, 403);
  const ct = (request.headers.get('content-type') || '').toLowerCase();
  if (!ct.startsWith('application/x-www-form-urlencoded')) return json({ ok: false, erro: 'formato' }, 415);
  const body = await request.text();
  if (body.length > 8192) return json({ ok: false, erro: 'grande' }, 413);
  const form = new URLSearchParams(body);
  const volta = new URL(`https://${url.host}/panel`);
  volta.searchParams.set('run', '1');
  try {
    if (form.get('acao') !== 'issue') throw new Error('unknown action');
    const id = form.get('id');
    const status = form.get('status');
    await resolveIssue(env, id, status, form.get('resolution'), auth.email);
    volta.searchParams.set('ok', `Issue #${id} ${status} with your note.`);
  } catch (e) {
    volta.searchParams.set('err', `Could not update the issue: ${String((e && e.message) || e).slice(0, 200)}`);
  }
  volta.hash = 'issues';
  return new Response(null, { status: 303, headers: { Location: volta.pathname + volta.search + volta.hash, 'Cache-Control': 'no-store' } });
}

export async function tratar(request, env, ctx, deps = {}) {
  const url = new URL(request.url);
  // dsba.duarte.top é só um atalho: qualquer pedido vira 302 para o painel no host protegido pelo Access.
  // Nada é servido neste host (nem /painel, /status etc.).
  if (url.hostname === HOST_ATALHO) {
    return new Response(null, { status: 302, headers: { Location: `https://${HOST_PAINEL}/panel${url.search}`, 'Cache-Control': 'no-store' } });
  }
  const path = url.pathname.replace(/\/$/, '') || '/';
  if (request.method === 'GET' && path === '/health') return json({ ok: true, servico: 'dsb-auditor' });

  // Ícones do painel (escudo + lupa), públicos e fora do Access: só arquivos estáticos de public/pwa/dsba/.
  if ((request.method === 'GET' || request.method === 'HEAD') && /^\/pwa\/dsba\/[\w.-]+\.(png|svg|ico)$/.test(url.pathname)) {
    return iconeEstatico(request, env);
  }

  // Fora do Access (/painel): browsers pedem /favicon.ico; redireciona ao ícone do painel.
  if (request.method === 'GET' && path === '/favicon.ico') {
    return Response.redirect(`https://${HOST_PAINEL}${ICONES_PAINEL}/favicon.ico`, 302);
  }

  // URLs are English: /panel, ?tab=views, ?window=. Old /painel links redirect (query mapped).
  if (path === '/painel' && (request.method === 'GET' || request.method === 'HEAD')) {
    const q = new URLSearchParams();
    for (const [k, v] of url.searchParams) {
      if (k === 'aba') q.set('tab', v === 'leituras' ? 'views' : v);
      else if (k === 'janela') q.set('window', v);
      else q.set(k, v);
    }
    const qs = q.toString();
    return new Response(null, { status: 301, headers: { Location: `/panel${qs ? `?${qs}` : ''}`, 'Cache-Control': 'no-store' } });
  }
  if (path === '/panel') {
    // STG: POST /panel resolves or ignores an issue (Access login, same-origin form, note required).
    if (request.method === 'POST' && usesApi(env)) return resolverIssue(request, env, url);
    if (request.method !== 'GET') return json({ ok: false, erro: 'metodo' }, 405);
    const auth = await autorizarPainel(request, env);
    if (!auth.ok) {
      if (auth.status === 404) return json({ ok: false, erro: 'nao_encontrado' }, 404);
      return json({ ok: false, erro: auth.erro }, auth.status);
    }
    const aba = url.searchParams.get('tab') === 'views' ? 'leituras' : '';
    if (aba === 'leituras') {
      const janela = url.searchParams.get('window') || '7d';
      return html(renderLeituras(await obterLeituras(env), { janela, ambiente: env.AMBIENTE === 'stg' ? 'stg' : '' }));
    }
    let ultimo = await lerUltimo(env.DSB_AUDITOR);
    // STG has no cron (account cron limit): RUN_ON_VIEW=on runs the audit when the panel is opened
    // and the last run is older than 5 min (or ?run=1). Alerts stay off there (ALERTAS=off).
    if (env.RUN_ON_VIEW === 'on' && (!ultimo || url.searchParams.get('run') === '1' || Date.now() - Date.parse(ultimo.em) > 5 * 60_000)) {
      ultimo = await rodarAuditoria(env, { slot: 'view', ...deps });
      await dispararFilaPush(env); // STG stand-in for the cron tick: the queue's new-post alerts (needs the FILA binding)
    }
    const ultimoAlerta = await lerUltimoAlerta(env.DSB_AUDITOR);
    const flash = usesApi(env) && (url.searchParams.get('ok') || url.searchParams.get('err'))
      ? { texto: String(url.searchParams.get('ok') || url.searchParams.get('err')).slice(0, 300), erro: !url.searchParams.get('ok') }
      : null;
    return html(renderPainel(ultimo, { ultimoAlerta, ambiente: env.AMBIENTE === 'stg' ? 'stg' : '', flash, fonte: usesApi(env) ? 'api' : 'notion' }));
  }

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

/** STG: JSON error replies carry English codes. */
export async function jsonErroEn(res) {
  if (res.status < 400 || !(res.headers.get('Content-Type') || '').includes('application/json')) return res;
  const j = await res.clone().json().catch(() => null);
  if (!j || !ERRO_EN[j.erro]) return res;
  const { erro, ...rest } = j;
  return new Response(JSON.stringify({ ...rest, error: ERRO_EN[erro] }), { status: res.status, headers: res.headers });
}

export default {
  async fetch(request, env, ctx) {
    const res = await tratar(request, env, ctx);
    return jsonErroEn(res);
  },
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(dispararFilaPush(env)); // avisos da fila (dsb-fila); isolado da auditoria
    const slot = slotDoTick(controller.scheduledTime);
    if (!slot) return; // tick fora dos horários: sai sem rede nem KV
    ctx.waitUntil(rodarAuditoria(env, { agora: new Date(controller.scheduledTime), slot }));
  },
};
