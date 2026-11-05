// Utilidades das rotas de inscrição Web Push (KV: DSB_PUSH, chave "sub:<sha256(endpoint)>").
const ORIGENS = ['https://dsb.duarte.top'];
const SERVICOS = [
  /\.googleapis\.com$/,
  /\.push\.apple\.com$/,
  /\.mozilla\.(com|org)$/,
  /\.notify\.windows\.com$/,
  /^push\.services\.mozilla\.com$/,
];

function corsHeaders(request) {
  const o = request.headers.get('Origin') || '';
  const allow = ORIGENS.includes(o) ? o : ORIGENS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

export const json = (obj, status = 200, request = null) =>
  new Response(status === 204 ? null : JSON.stringify(obj), {
    status,
    headers: {
      ...(status === 204 ? {} : { 'Content-Type': 'application/json; charset=utf-8' }),
      'Cache-Control': 'no-store',
      ...(request ? corsHeaders(request) : { 'Access-Control-Allow-Origin': ORIGENS[0] }),
    },
  });

export function origemOk(request) {
  const o = request.headers.get('Origin');
  if (!o) return false;
  if (ORIGENS.includes(o)) return true;
  try {
    const h = new URL(o).hostname;
    return (
      h.endsWith('.datasecuritybriefing.workers.dev') ||
      h.endsWith('.pages.dev')
    );
  } catch {
    return false;
  }
}

export async function lerCorpo(request) {
  const txt = await request.text();
  if (txt.length > 4096) throw new Error('grande');
  return JSON.parse(txt);
}

export function endpointOk(ep) {
  try {
    const u = new URL(ep);
    return (
      u.protocol === 'https:' &&
      ep.length < 1024 &&
      SERVICOS.some((r) => r.test(u.hostname))
    );
  } catch {
    return false;
  }
}

export async function chave(endpoint) {
  const h = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(endpoint),
  );
  return (
    'sub:' +
    [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('')
  );
}
