/** Espelha scripts/push/enviar.mjs. Omissão = todos; array vazio = nenhum. */
export const REGIOES = {
  br: ['br'],
  mx: ['mx'],
  latam: ['ar', 'cl', 'pe', 'py', 'uy', 'co', 'latam'],
  us: ['us'],
  eu: ['eu'],
  global: ['global'],
};

export function combinaTipo(inscricao, tipo) {
  if (!Array.isArray(inscricao.tipos)) return true;
  if (!inscricao.tipos.length) return false;
  if (!tipo) return true;
  return inscricao.tipos.includes(tipo);
}

export function combinaRegiao(inscricao, pais) {
  if (!Array.isArray(inscricao.regioes)) return true;
  if (!inscricao.regioes.length) return false;
  if (!pais) return true;
  return inscricao.regioes.some((regiao) => (REGIOES[regiao] || []).includes(pais));
}

export function inscricaoCompativel(inscricao, { tipo, pais, topico }) {
  if (topico) {
    if (!Array.isArray(inscricao.topicos) || !inscricao.topicos.includes(topico)) return false;
  }
  if (!combinaTipo(inscricao, tipo)) return false;
  if (!combinaRegiao(inscricao, pais)) return false;
  return true;
}
