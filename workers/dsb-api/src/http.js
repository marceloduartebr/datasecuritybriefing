export class ErroApi extends Error {
  /**
   * @param {number} status HTTP
   * @param {string} codigo identificador estável para o agente tratar
   * @param {string} mensagem texto curto em português
   * @param {object} [extra] dados para quem chamou (ex.: item que colidiu)
   */
  constructor(status, codigo, mensagem, extra = {}) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
    this.extra = extra;
  }
}

export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function lerCorpo(request) {
  let texto = '';
  try {
    texto = await request.text();
  } catch {
    throw new ErroApi(400, 'corpo_invalido', 'Não foi possível ler o corpo da requisição');
  }
  if (!texto) return {};
  let j;
  try {
    j = JSON.parse(texto);
  } catch {
    throw new ErroApi(400, 'json_invalido', 'Corpo não é JSON válido');
  }
  if (!j || typeof j !== 'object' || Array.isArray(j)) throw new ErroApi(400, 'json_invalido', 'O corpo deve ser um objeto JSON');
  return j;
}

export const agoraIso = () => new Date().toISOString();

/** undefined → null (o D1 recusa undefined em bind). */
export const nz = (v) => (v === undefined ? null : v);

/** Converte erro de restrição do SQLite em ErroApi legível. */
export function erroDeRestricao(e) {
  const msg = String((e && e.message) || e);
  if (/UNIQUE constraint failed: posts\.slug/.test(msg)) return new ErroApi(409, 'slug_em_uso', 'Slug já usado por outro item');
  if (/UNIQUE constraint failed: posts\.notion_id/.test(msg)) return new ErroApi(409, 'notion_id_em_uso', 'Página do Notion já importada');
  if (/UNIQUE constraint failed: post_keys\.key|post_keys\.key/.test(msg)) return new ErroApi(409, 'assunto_ja_coberto', 'Chave de assunto já pertence a outro item');
  if (/UNIQUE constraint failed: publications/.test(msg)) return new ErroApi(409, 'publicacao_ja_reservada', 'Já existe publicação para este canal e idioma');
  if (/CHECK constraint failed/.test(msg)) return new ErroApi(422, 'dado_invalido', 'Valor fora das regras do banco', { detalhe: msg.slice(0, 300) });
  if (/FOREIGN KEY constraint failed/.test(msg)) return new ErroApi(422, 'referencia_invalida', 'Referência a item inexistente');
  if (/NOT NULL constraint failed/.test(msg)) return new ErroApi(422, 'campo_obrigatorio', 'Campo obrigatório ausente', { detalhe: msg.slice(0, 300) });
  return null;
}
