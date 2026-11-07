import { SITE, TIMEOUT_PUSH_MS } from './constantes.js';
import { normalizarItens } from '../../../src/lib/push-catalogo.mjs';
import { classificarResposta } from './entrega.js';
import { montarPedidoPush } from './crypto-push.js';

export async function baixarCatalogo(fetchImpl, url) {
  try {
    const res = await fetchImpl(url, {
      headers: { 'User-Agent': 'DSB-Push-Agenda/1.0' },
      cache: 'no-store',
    });
    if (!res.ok) return { erro: 'http', status: res.status };
    return normalizarItens(await res.json());
  } catch {
    return { erro: 'rede' };
  }
}

export async function confirmarNoAr(fetchImpl, urlPath) {
  let url;
  try {
    url = new URL(urlPath, SITE);
  } catch {
    return false;
  }
  if (url.origin !== SITE || !url.pathname.startsWith('/briefings/')) return false;
  try {
    const res = await fetchImpl(url.toString(), {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': 'DSB-Push-Agenda/1.0' },
    });
    return res.ok === true;
  } catch {
    return false;
  }
}

export async function postarPush(pedido, fetchImpl, timeoutMs = TIMEOUT_PUSH_MS) {
  const controle = new AbortController();
  let timer;
  try {
    const res = await new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        controle.abort();
        const erro = new Error('timeout');
        erro.name = 'TimeoutError';
        reject(erro);
      }, timeoutMs);
      Promise.resolve(
        fetchImpl(pedido.url, {
          method: 'POST',
          headers: pedido.headers,
          body: pedido.body,
          signal: controle.signal,
        }),
      ).then(resolve, reject);
    });
    let retryAfter = null;
    try {
      retryAfter = res.headers.get('Retry-After');
    } catch {
      retryAfter = null;
    }
    return classificarResposta({ status: res.status, retryAfter });
  } catch (e) {
    const nome = e && e.name;
    if (nome === 'TimeoutError' || nome === 'AbortError') return classificarResposta({ erro: 'timeout' });
    return classificarResposta({ erro: 'rede' });
  } finally {
    clearTimeout(timer);
  }
}

export async function enviarParaInscrito({ registro, payload, vapid, agora, fetchImpl }) {
  const pedido = await montarPedidoPush({
    endpoint: registro.endpoint,
    p256dh: registro.keys && registro.keys.p256dh,
    auth: registro.keys && registro.keys.auth,
    payload,
    vapid,
    agora,
  });
  return postarPush(pedido, fetchImpl);
}
