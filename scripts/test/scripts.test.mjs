import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checar, capaValida } from '../checar-capas.mjs';
import { planejar, aplicar } from '../remover-artigo.mjs';

function fixture(arquivos) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'dsb-'));
  for (const p of ['briefings', 'briefings-es', 'briefings-en']) mkdirSync(path.join(raiz, 'src', 'content', p), { recursive: true });
  for (const [rel, txt] of Object.entries(arquivos)) writeFileSync(path.join(raiz, 'src', 'content', rel), txt);
  return raiz;
}
const md = (cover) => `---\ntitle: "T"\n${cover ? `cover: "${cover}"\n` : ''}notionUrl: "https://www.notion.so/abc"\n---\ncorpo\n`;
const OK = 'https://covers.duarte.top/covers/a.jpg';

test('capa: host e caminho', () => {
  assert.equal(capaValida(OK), true);
  assert.equal(capaValida('https://example.com/a.jpg'), false);
});

test('checar-capas: erro sem cover ou host errado; paridade é aviso', () => {
  const raiz = fixture({
    'briefings/2026-01-01-a.md': md(OK),
    'briefings-es/2026-01-01-a.md': md(OK),
    'briefings/2026-01-02-b.md': md(null),
    'briefings-en/2026-01-02-b.md': md('https://evil.example/x.jpg'),
  });
  const r = checar(raiz);
  assert.equal(r.erros.length, 2);
  assert.ok(r.avisos.some((a) => a.includes('2026-01-01-a.md: falta em briefings-en')));
});

test('remover-artigo: dry-run não apaga; aplicar apaga as 3 línguas', () => {
  const raiz = fixture({
    'briefings/2026-01-01-a.md': md(OK),
    'briefings-es/2026-01-01-a.md': md(OK),
    'briefings-en/2026-01-01-a.md': md(OK),
    'briefings/2026-01-01-outro.md': md(OK),
  });
  assert.equal(planejar('../etc', raiz).erro, 'slug_invalido');
  assert.equal(planejar('2026-01-01-zzz', raiz).erro, 'nao_encontrado');
  const plano = planejar('2026-01-01-a', raiz);
  assert.equal(plano.arquivos.length, 3);
  assert.equal(plano.notionUrl, 'https://www.notion.so/abc');
  assert.ok(existsSync(path.join(raiz, 'src/content/briefings/2026-01-01-a.md')));
  assert.equal(aplicar(plano), 3);
  assert.ok(!existsSync(path.join(raiz, 'src/content/briefings-es/2026-01-01-a.md')));
  assert.ok(existsSync(path.join(raiz, 'src/content/briefings/2026-01-01-outro.md')));
});
