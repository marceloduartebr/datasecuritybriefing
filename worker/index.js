/**
 * Worker mínimo do DSB: só /api/push/*; o resto fica nos assets estáticos (Astro dist).
 * Espelha o BND (Pages Functions) adaptado a Workers + assets.
 */
import {
  json,
  origemOk,
  lerCorpo,
  endpointOk,
  chave,
} from './push/api-comum.js';

async function subscribe(request, env) {
  if (!origemOk(request)) return json({ ok: false, erro: 'origem' }, 403, request);
  let corpo;
  try {
    corpo = await lerCorpo(request);
  } catch {
    return json({ ok: false, erro: 'corpo' }, 400, request);
  }
  const s = corpo && corpo.subscription;
  const p256dh = s && s.keys && s.keys.p256dh;
  const auth = s && s.keys && s.keys.auth;
  if (
    !s ||
    !endpointOk(s.endpoint) ||
    typeof p256dh !== 'string' ||
    typeof auth !== 'string' ||
    p256dh.length > 200 ||
    auth.length > 100
  ) {
    return json({ ok: false, erro: 'inscricao' }, 400, request);
  }
  const topicos = Array.isArray(corpo.topicos)
    ? corpo.topicos.filter((t) => t === 'edicao')
    : ['edicao'];
  if (!topicos.length) topicos.push('edicao');
  const registro = {
    endpoint: s.endpoint,
    keys: { p256dh, auth },
    topicos,
    criado: new Date().toISOString(),
    ua: (request.headers.get('User-Agent') || '').slice(0, 160),
  };
  await env.DSB_PUSH.put(await chave(s.endpoint), JSON.stringify(registro));
  return json({ ok: true }, 200, request);
}

async function unsubscribe(request, env) {
  if (!origemOk(request)) return json({ ok: false, erro: 'origem' }, 403, request);
  let corpo;
  try {
    corpo = await lerCorpo(request);
  } catch {
    return json({ ok: false, erro: 'corpo' }, 400, request);
  }
  const ep =
    corpo &&
    (corpo.endpoint || (corpo.subscription && corpo.subscription.endpoint));
  if (!endpointOk(ep)) return json({ ok: false, erro: 'endpoint' }, 400, request);
  await env.DSB_PUSH.delete(await chave(ep));
  return json({ ok: true }, 200, request);
}

function corsPreflight(request) {
  if (!origemOk(request)) return json({ ok: false, erro: 'origem' }, 403, request);
  return json({ ok: true }, 204, request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (path === '/api/push/subscribe' || path === '/api/push/unsubscribe') {
      if (request.method === 'OPTIONS') return corsPreflight(request);
      if (request.method !== 'POST') return json({ ok: false, erro: 'metodo' }, 405, request);
      if (path.endsWith('/subscribe')) return subscribe(request, env);
      return unsubscribe(request, env);
    }

    // run_worker_first só chama o Worker em /api/push/*; fallback por segurança
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not found', { status: 404 });
  },
};
