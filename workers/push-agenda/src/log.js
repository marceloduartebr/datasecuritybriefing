const CHAVE_PROIBIDA = /endpoint|p256|auth|token|vapid|authorization|subscription|keys|payload|bearer|inscrito|senha|secret/i;

function valorSeguro(valor) {
  if (typeof valor === 'number' || typeof valor === 'boolean' || valor === null) return valor;
  if (typeof valor !== 'string') return undefined;
  if (valor.length > 180) return undefined;
  if (/^sub:[0-9a-f]{8,}/i.test(valor)) return undefined;
  if (/bearer\s+/i.test(valor)) return undefined;
  if (valor.includes('p256dh') || valor.includes('-----BEGIN')) return undefined;
  return valor;
}

/** Log estruturado. Campos e valores com inscrição, chave ou endpoint são omitidos. */
export function logEvento(evento, campos = {}) {
  const seguro = { evento };
  for (const [chave, valor] of Object.entries(campos)) {
    if (CHAVE_PROIBIDA.test(chave)) continue;
    const limpo = valorSeguro(valor);
    if (limpo !== undefined) seguro[chave] = limpo;
  }
  console.log(JSON.stringify(seguro));
  return seguro;
}
