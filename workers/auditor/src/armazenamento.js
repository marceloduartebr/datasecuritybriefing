import { HISTORICO_MAX } from './constantes.js';

/** 2 gravações por execução (≤ 12/dia), longe das 1.000/dia do KV Free. */
export async function gravarExecucao(kv, r) {
  if (!kv) return;
  const resumo = { em: r.em, slot: r.slot, ok: r.ok, problemas: r.problemas.length };
  let hist = [];
  try {
    hist = (await kv.get('historico', 'json')) || [];
  } catch {
    hist = [];
  }
  hist = [resumo, ...hist].slice(0, HISTORICO_MAX);
  await kv.put('ultimo', JSON.stringify(r));
  await kv.put('historico', JSON.stringify(hist));
}

export async function lerUltimo(kv) {
  try {
    return (await kv.get('ultimo', 'json')) || null;
  } catch {
    return null;
  }
}

export async function lerHistorico(kv) {
  try {
    return (await kv.get('historico', 'json')) || [];
  } catch {
    return [];
  }
}
