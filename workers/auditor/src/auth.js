import { validarAccessJwt } from './access.js';

async function iguais(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const ux = new Uint8Array(x);
  const uy = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < ux.length; i++) d |= ux[i] ^ uy[i];
  return d === 0;
}

/** Bearer AUDITOR_TOKEN (secret). Sem secret configurado: 503, nunca aberto. */
export async function autorizar(request, env) {
  const esperado = env && env.AUDITOR_TOKEN;
  if (typeof esperado !== 'string' || esperado.length < 24) return { ok: false, status: 503, erro: 'nao_configurado' };
  const m = /^Bearer\s+(\S+)$/.exec(request.headers.get('Authorization') || '');
  if (!m || !(await iguais(m[1], esperado))) return { ok: false, status: 401, erro: 'nao_autorizado' };
  return { ok: true };
}

/**
 * Auth do /painel:
 * 1) Se ACCESS_TEAM + ACCESS_AUD estão setados e há Cf-Access-Jwt-Assertion válido → ok.
 * 2) Senão, Bearer AUDITOR_TOKEN (checagens internas).
 * 3) Sem Access configurado e sem bearer → 404 (página não pública).
 * 4) Access configurado, JWT inválido/ausente e sem bearer → 401.
 * Nunca aceita token em query string ou cookie.
 */
export async function autorizarPainel(request, env) {
  const team = env && env.ACCESS_TEAM;
  const aud = env && env.ACCESS_AUD;
  const accessOn = typeof team === 'string' && team.length > 0 && typeof aud === 'string' && aud.length > 0;
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion') || request.headers.get('cf-access-jwt-assertion');

  if (accessOn && jwt) {
    try {
      await validarAccessJwt(jwt, team, aud);
      return { ok: true, via: 'access' };
    } catch {
      /* cai no bearer */
    }
  }

  const bearer = await autorizar(request, env);
  if (bearer.ok) return { ok: true, via: 'bearer' };

  if (!accessOn) return { ok: false, status: 404, erro: 'nao_encontrado' };
  return { ok: false, status: 401, erro: 'nao_autorizado' };
}
