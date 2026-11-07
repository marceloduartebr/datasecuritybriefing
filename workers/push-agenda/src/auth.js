async function hashesIguais(fornecido, esperado) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(fornecido)),
    crypto.subtle.digest('SHA-256', encoder.encode(esperado)),
  ]);
  if (typeof crypto.subtle.timingSafeEqual === 'function') {
    return crypto.subtle.timingSafeEqual(a, b);
  }
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

export async function tokensIguais(fornecido, esperado) {
  if (typeof fornecido !== 'string' || typeof esperado !== 'string') return false;
  return hashesIguais(fornecido, esperado);
}

export async function autorizarAdmin(request, env) {
  const esperado = env && env.ADMIN_TOKEN;
  if (typeof esperado !== 'string' || esperado.length < 16) {
    return { ok: false, status: 503, erro: 'admin_nao_configurado' };
  }
  const header = request.headers.get('Authorization') || '';
  const m = /^Bearer\s+(\S+)$/.exec(header);
  if (!m || !(await tokensIguais(m[1], esperado))) {
    return { ok: false, status: 401, erro: 'nao_autorizado' };
  }
  return { ok: true };
}
