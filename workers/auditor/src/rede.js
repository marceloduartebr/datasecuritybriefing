import { TIMEOUT_MS, UA } from './constantes.js';

/** fetch com orçamento de subrequests e timeout; nunca lança. */
export function criarRede(fetchImpl, orcamento) {
  const estado = { usadas: 0, orcamento, estourou: false };
  async function pedir(url, init = {}) {
    if (estado.usadas >= estado.orcamento) {
      estado.estourou = true;
      return { ok: false, status: 0, erro: 'orcamento' };
    }
    estado.usadas++;
    const controle = new AbortController();
    const timer = setTimeout(() => controle.abort(), TIMEOUT_MS);
    try {
      const headers = { 'User-Agent': UA, ...(init.headers || {}) };
      const res = await fetchImpl(url, { ...init, headers, signal: controle.signal });
      return res;
    } catch {
      return { ok: false, status: 0, erro: 'rede' };
    } finally {
      clearTimeout(timer);
    }
  }
  return { pedir, estado };
}

export async function lerJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function lerTexto(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
