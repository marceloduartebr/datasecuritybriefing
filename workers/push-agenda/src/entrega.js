import { TETO_ATRASO_MS } from './constantes.js';

const ATRASO_MS = [30_000, 60_000, 180_000, 600_000, 900_000];
const ATRASO_429_MS = [60_000, 120_000, 300_000, 600_000, 900_000];

export function classificarResposta({ status, retryAfter, erro } = {}) {
  if (erro === 'timeout') return { classe: 'timeout' };
  if (erro) return { classe: 'transiente' };
  if (status === 404 || status === 410) return { classe: 'expirado', status };
  if (status === 429) {
    return { classe: 'transiente', status, retryAfterSeg: lerRetryAfter(retryAfter) };
  }
  if (typeof status === 'number' && status >= 500 && status <= 599) {
    return { classe: 'transiente', status };
  }
  if (typeof status === 'number' && status >= 200 && status < 300) {
    return { classe: 'ok', status };
  }
  return { classe: 'permanente', status: status ?? null };
}

export function lerRetryAfter(valor) {
  if (valor == null || valor === '') return null;
  const seg = Number(valor);
  if (Number.isFinite(seg)) return seg;
  const quando = Date.parse(String(valor));
  if (Number.isNaN(quando)) return null;
  return Math.max(0, Math.round((quando - Date.now()) / 1000));
}

/** tentativas = quantas falhas já contam nesta entrega (1 na primeira falha). */
export function atrasoMs(tentativas, { status, retryAfterSeg } = {}) {
  const tabela = status === 429 ? ATRASO_429_MS : ATRASO_MS;
  const indice = Math.min(Math.max(tentativas, 1), tabela.length) - 1;
  let ms = tabela[indice];
  if (Number.isFinite(retryAfterSeg) && retryAfterSeg > 0) {
    ms = Math.max(ms, retryAfterSeg * 1000);
  }
  return Math.min(ms, TETO_ATRASO_MS);
}
