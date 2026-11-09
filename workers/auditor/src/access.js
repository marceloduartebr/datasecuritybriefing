/**
 * Validação do JWT do Cloudflare Access (Cf-Access-Jwt-Assertion).
 * Sem dependências: Web Crypto + JWKS em https://<team>/cdn-cgi/access/certs.
 * Vars: ACCESS_TEAM (https://….cloudflareaccess.com) e ACCESS_AUD (AUD tag do app).
 */

function b64urlParaBytes(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function jsonDeParte(parte) {
  return JSON.parse(new TextDecoder().decode(b64urlParaBytes(parte)));
}

let jwksCache = { url: '', em: 0, keys: null };

async function obterJwks(issuer) {
  const url = `${issuer}/cdn-cgi/access/certs`;
  const agora = Date.now();
  if (jwksCache.url === url && jwksCache.keys && agora - jwksCache.em < 3600_000) return jwksCache.keys;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`jwks_${res.status}`);
  const body = await res.json();
  const keys = Array.isArray(body.keys) ? body.keys : [];
  jwksCache = { url, em: agora, keys };
  return keys;
}

/** @returns {Promise<object>} payload do JWT se válido */
export async function validarAccessJwt(token, teamDomain, aud, { fetchJwks = obterJwks, agoraSec } = {}) {
  if (typeof token !== 'string' || !token) throw new Error('sem_token');
  if (typeof teamDomain !== 'string' || !teamDomain) throw new Error('sem_team');
  if (typeof aud !== 'string' || !aud) throw new Error('sem_aud');
  const partes = token.split('.');
  if (partes.length !== 3) throw new Error('formato');
  const [hB64, pB64, sB64] = partes;
  const header = jsonDeParte(hB64);
  const payload = jsonDeParte(pB64);
  if (header.alg !== 'RS256') throw new Error('alg');
  const issuer = teamDomain.replace(/\/$/, '');
  if (payload.iss !== issuer) throw new Error('iss');
  const audOk = Array.isArray(payload.aud) ? payload.aud.includes(aud) : payload.aud === aud;
  if (!audOk) throw new Error('aud');
  const now = agoraSec != null ? agoraSec : Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now) throw new Error('exp');
  if (typeof payload.nbf === 'number' && payload.nbf > now + 60) throw new Error('nbf');

  const keys = await fetchJwks(issuer);
  const jwk = keys.find((k) => k.kid === header.kid) || keys.find((k) => k.kty === 'RSA');
  if (!jwk) throw new Error('sem_chave');
  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlParaBytes(sB64),
    new TextEncoder().encode(`${hB64}.${pB64}`),
  );
  if (!ok) throw new Error('sig');
  return payload;
}

/** Só para testes: limpa o cache do JWKS. */
export function _resetJwksCache() {
  jwksCache = { url: '', em: 0, keys: null };
}
