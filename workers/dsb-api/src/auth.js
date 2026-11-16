async function iguais(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b))
  ]);
  const ux = new Uint8Array(x);
  const uy = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < ux.length; i++) d |= ux[i] ^ uy[i];
  return d === 0;
}

const valido = (s) => typeof s === 'string' && s.length >= 24;

/**
 * Quem está chamando:
 * - Service Binding dos apps: header x-interno-token = INTERNO_TOKEN; ator = x-ator (e-mail do Access ou nome do app).
 * - Agentes: Bearer TOKEN_GROK → Grok_Assistant; Bearer TOKEN_CLAUDE → Claude_Assistant.
 * Sem nenhum secret configurado: 503 (nunca aberto). Token em query string ou cookie não é aceito.
 */
export async function autenticar(request, env) {
  const interno = env && env.INTERNO_TOKEN;
  const grok = env && env.TOKEN_GROK;
  const claude = env && env.TOKEN_CLAUDE;
  if (!valido(interno) && !valido(grok) && !valido(claude)) {
    return { ok: false, status: 503, erro: 'nao_configurado' };
  }

  const hInterno = request.headers.get('x-interno-token');
  if (hInterno && valido(interno) && (await iguais(hInterno, interno))) {
    const ator = (request.headers.get('x-ator') || 'app').slice(0, 120);
    return { ok: true, ator, agente: 'user', via: 'interno' };
  }

  const m = /^Bearer\s+(\S+)$/.exec(request.headers.get('Authorization') || '');
  if (m) {
    if (valido(grok) && (await iguais(m[1], grok))) return { ok: true, ator: 'Grok_Assistant', agente: 'Grok_Assistant', via: 'token' };
    if (valido(claude) && (await iguais(m[1], claude))) return { ok: true, ator: 'Claude_Assistant', agente: 'Claude_Assistant', via: 'token' };
  }
  return { ok: false, status: 401, erro: 'nao_autorizado' };
}
