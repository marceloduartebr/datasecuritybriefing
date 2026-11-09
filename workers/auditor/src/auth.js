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
