export function adaptadorSqlite(raw) {
  return {
    exec(sql, params = []) {
      const limpos = params.map((p) => (p === undefined ? null : p));
      const stmt = raw.prepare(sql);
      if (/^\s*select/i.test(sql)) return stmt.all(...limpos);
      stmt.run(...limpos);
      return [];
    },
  };
}

export function adaptadorDo(storage) {
  return {
    exec(sql, params = []) {
      const limpos = params.map((p) => (p === undefined ? null : p));
      const cursor = storage.sql.exec(sql, ...limpos);
      if (cursor && typeof cursor.toArray === 'function') return cursor.toArray();
      return [];
    },
  };
}
