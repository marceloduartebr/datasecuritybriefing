// Minimal D1 API adapter over node:sqlite, to test dsb-api against the real migrations.
// Covers what the Worker uses: prepare().bind().first()/all()/run() and transactional batch().
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const norm = (v) => (v === undefined ? (() => { throw new TypeError('D1_TYPE_ERROR: undefined in bind'); })() : typeof v === 'boolean' ? (v ? 1 : 0) : v);

class Stmt {
  constructor(db, sql, params = []) {
    this.db = db;
    this.sql = sql;
    this.params = params;
  }
  bind(...params) {
    return new Stmt(this.db, this.sql, params.map(norm));
  }
  _returnsRows() {
    return /^\s*(SELECT|WITH)\b/i.test(this.sql) || /\bRETURNING\b/i.test(this.sql);
  }
  _exec() {
    const st = this.db.prepare(this.sql);
    if (this._returnsRows()) {
      const results = st.all(...this.params).map((r) => ({ ...r }));
      const ch = this.db.prepare('SELECT changes() AS c').get().c;
      return { success: true, results, meta: { changes: /^\s*(SELECT|WITH)\b/i.test(this.sql) ? 0 : ch } };
    }
    const r = st.run(...this.params);
    return { success: true, results: [], meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } };
  }
  async first(col) {
    const r = this._exec().results[0] ?? null;
    return r && col ? r[col] : r;
  }
  async all() {
    return this._exec();
  }
  async run() {
    return this._exec();
  }
}

export function createD1() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  const dir = join(here, '..', 'migrations');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.sql')).sort()) db.exec(readFileSync(join(dir, f), 'utf8'));
  return {
    _db: db,
    prepare: (sql) => new Stmt(db, sql),
    async batch(stmts) {
      db.exec('BEGIN');
      try {
        const out = stmts.map((s) => s._exec());
        db.exec('COMMIT');
        return out;
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
    async exec(sql) {
      db.exec(sql);
    }
  };
}
