import { DatabaseSync } from 'node:sqlite';
import { criarSchema, gravarMeta } from '../src/logica.js';
import { adaptadorSqlite } from '../src/sql.js';

export function banco() {
  const db = adaptadorSqlite(new DatabaseSync(':memory:'));
  criarSchema(db);
  return db;
}

export function ligar(db, cutoff = '2026-11-07T00:00:00.000Z') {
  gravarMeta(db, 'envio', 'on');
  gravarMeta(db, 'cutoff', cutoff);
}

export function item(parcial = {}) {
  return {
    slug: '2026-11-07-alfa',
    titulo: 'Título do dia',
    url: '/briefings/2026-11-07-alfa',
    data: '2026-11-07',
    publicadoEm: '2026-11-07T13:00:00.000Z',
    tipo: 'incidente',
    pais: 'br',
    ...parcial,
  };
}

export function inscrito(id, parcial = {}) {
  return {
    inscrito: id,
    topicos: ['edicao'],
    tipos: ['incidente'],
    regioes: ['br'],
    ...parcial,
  };
}

export function paginador(lista) {
  let i = 0;
  return async ({ limite }) => {
    const fatia = lista.slice(i, i + limite);
    i += fatia.length;
    const completo = i >= lista.length;
    return { chaves: fatia, completo, cursor: completo ? '' : String(i) };
  };
}
