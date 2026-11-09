import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const sw = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');

test('sw.js: versão injetada no build e handlers de push intactos', () => {
  assert.match(sw, /const VERSAO = "__DSB_BUILD__";/);
  for (const ev of ['install', 'activate', 'fetch', 'message', 'push', 'notificationclick']) {
    assert.ok(sw.includes(`addEventListener("${ev}"`), ev);
  }
  assert.ok(sw.includes('self.skipWaiting()') && sw.includes('self.clients.claim()'));
  assert.ok(sw.includes('"/_astro/"'));
});

test('_headers: sw.js sem cache HTTP', () => {
  const h = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8');
  assert.match(h, /\/sw\.js\n\s+Cache-Control: no-cache/);
});
