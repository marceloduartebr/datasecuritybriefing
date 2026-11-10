import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPainel } from '../src/painel.js';

const R = { em: '2026-11-10T22:15:00Z', dataBrt: '2026-11-10', horaBrt: '19:15', slot: '19:15', ok: true, problemas: [], flags: {} };

test('puxar para atualizar: só standalone, pílula criada no gesto, abaixo do topo, recarrega do servidor', () => {
  const html = renderPainel(R);
  assert.match(html, /display-mode: standalone/);
  assert.match(html, /navigator\.standalone===true/);
  assert.match(html, /Puxe para atualizar/);
  assert.match(html, /Solte para atualizar/);
  assert.match(html, /Atualizando…/);
  assert.match(html, /location\.reload\(\)/);
  assert.match(html, /pil\.remove\(\)/);
  // em repouso não há pílula no HTML (sem camada invisível sobre o topo)
  assert.doesNotMatch(html, /<div class="ptr"/);
  const ptr = /\.ptr\{([^}]*)\}/.exec(html)[1];
  assert.match(ptr, /z-index:10/); // topo tem z-index 20
  assert.match(ptr, /top:calc\(env\(safe-area-inset-top,0px\) \+ 4\.5rem\)/);
  assert.match(ptr, /pointer-events:none/);
  assert.doesNotMatch(ptr, /backdrop-filter/);
  assert.match(html, /overscroll-behavior-y:contain/);
});

test('recompõe o topo ao voltar ao primeiro plano, sem reload automático', () => {
  const html = renderPainel(R);
  assert.match(html, /visibilitychange/);
  assert.match(html, /translateZ\(0\)/);
  assert.match(html, /requestAnimationFrame\(function\(\)\{requestAnimationFrame/);
});

test('scripts do painel são JS válido', () => {
  const html = renderPainel(R);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.ok(scripts.length >= 3);
  for (const s of scripts) new Function(s);
});
