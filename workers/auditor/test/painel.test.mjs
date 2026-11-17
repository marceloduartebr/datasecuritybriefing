import { test } from 'node:test';
import assert from 'node:assert/strict';

test('STG panel: type tags, cover reasons, settings, alert reasons and JSON errors in English', async () => {
  const { toEnglish } = await import('../src/i18n.js');
  const { jsonErroEn } = await import('../src/index.js');
  const out = toEnglish('<span class="tag">Notícia</span><span class="tag">Incidente</span><div>Sem tipo</div><li>q — sem_capa</li><li>q — host_invalido</li><li>q — http</li>' +
    '<li>Blog: 2026-11-16-x capa falhou</li><li>Blog: 2026-11-16-y capa http</li><li>ALERTAS: <strong>off</strong></li><li>ALERTA_OK_DIARIO: <strong>off</strong></li>' +
    '<p><strong>DSB: 3 problema(s) às 09:50</strong></p><p class="muted">x · motivo: repetido</p><p class="muted">Nenhum alerta enviado ainda hoje. Última execução: alertas_off.</p>');
  for (const s of ['class="tag">News<', 'class="tag">Incident<', '>No type<', 'q — no cover<', 'not on covers.duarte.top<', 'does not answer 200<', 'x cover failed', 'y cover does not answer 200',
    'Alerts: ', 'Daily all-clear alert: ', 'DSB: 3 problem(s) at 09:50', 'reason: same alert already sent today', 'Last run: alerts off.'])
    assert.ok(out.includes(s), s);
  for (const s of ['Notícia', 'Incidente', 'Sem tipo', 'sem_capa', 'host_invalido', 'falhou', 'ALERTAS', 'problema(s)', 'repetido', 'alertas_off']) assert.ok(!out.includes(s), `left: ${s}`);
  const r = await jsonErroEn(new Response(JSON.stringify({ ok: false, erro: 'nao_autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }));
  assert.deepEqual(await r.json(), { ok: false, error: 'unauthorized' });
  assert.equal(r.status, 401);
});
