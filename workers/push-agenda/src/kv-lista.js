/** Lista todas as chaves de um prefixo, seguindo o cursor do KV. */
export async function listarTodasChaves(kv, prefix) {
  const nomes = [];
  let cursor;
  let guard = 0;
  do {
    const page = await kv.list({ prefix, cursor, limit: 1000 });
    for (const chave of page.keys || []) nomes.push(chave.name);
    if (page.list_complete || !page.cursor) {
      cursor = undefined;
    } else {
      cursor = page.cursor;
    }
    guard += 1;
    if (guard > 1000) break;
  } while (cursor);
  return nomes;
}

/** Vista sem endpoint nem chaves. `bruto` é o JSON do KV ou null. */
export function vistaInscricao(inscrito, bruto) {
  if (typeof bruto !== 'string') return { inscrito, ilegivel: true };
  try {
    const s = JSON.parse(bruto);
    if (!s || typeof s !== 'object') return { inscrito, ilegivel: true };
    return {
      inscrito,
      tipos: s.tipos,
      regioes: s.regioes,
      topicos: s.topicos,
    };
  } catch {
    return { inscrito, ilegivel: true };
  }
}
