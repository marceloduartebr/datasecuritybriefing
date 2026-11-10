import { test } from 'node:test';
import assert from 'node:assert/strict';
import { severidadeSemCapa, HORA_INICIO_GERACAO, HORA_LIMITE_GERACAO } from '../src/severidade-capa.js';
import { calcularAlertas, calcularProblemas, montarAlerta } from '../src/alertas.js';
import { resumirPagina } from '../src/checagens.js';
import { renderPainel } from '../src/painel.js';

const brt = (s) => new Date(`${s}-03:00`);
const VELHO = '2026-11-09T18:28:00.000-03:00'; // segunda à noite
const terca = (hhmm) => brt(`2026-11-10T${hhmm}:00`);

test('constantes: rodada 09:30, limite 09:50', () => {
  assert.equal(HORA_INICIO_GERACAO, '09:30');
  assert.equal(HORA_LIMITE_GERACAO, '09:50');
});

test('item velho antes das 09:50 = alerta; a partir das 09:50 = problema', () => {
  assert.equal(severidadeSemCapa(VELHO, terca('08:30')), 'alerta');
  assert.equal(severidadeSemCapa(VELHO, terca('09:49')), 'alerta');
  assert.equal(severidadeSemCapa(VELHO, terca('09:50')), 'problema');
  assert.equal(severidadeSemCapa(VELHO, terca('19:15')), 'problema');
});

test('item que entrou depois do início da rodada (09:30) fica alerta até a próxima janela útil', () => {
  assert.equal(severidadeSemCapa('2026-11-10T09:31:00-03:00', terca('10:15')), 'alerta');
  assert.equal(severidadeSemCapa('2026-11-10T18:28:00-03:00', terca('19:15')), 'alerta');
  // dia útil seguinte: antes do limite ainda alerta, depois vira problema
  assert.equal(severidadeSemCapa('2026-11-10T18:28:00-03:00', brt('2026-11-11T08:30:00')), 'alerta');
  assert.equal(severidadeSemCapa('2026-11-10T18:28:00-03:00', brt('2026-11-11T09:50:00')), 'problema');
  // entrou antes das 09:30 de hoje (ex.: curadoria das 8h) e a rodada passou: problema
  assert.equal(severidadeSemCapa('2026-11-10T08:05:00-03:00', terca('10:15')), 'problema');
});

test('fim de semana = alerta, mesmo item velho', () => {
  assert.equal(severidadeSemCapa(VELHO, brt('2026-11-14T12:00:00')), 'alerta'); // sábado
  assert.equal(severidadeSemCapa(VELHO, brt('2026-11-15T12:00:00')), 'alerta'); // domingo
});

test('sem data de entrada: tratado como antigo', () => {
  assert.equal(severidadeSemCapa(null, terca('10:15')), 'problema');
  assert.equal(severidadeSemCapa(null, terca('09:00')), 'alerta');
});

test('resumirPagina: Added At, senão created_time', () => {
  const base = { id: 'a-b', properties: { Topic: { title: [{ plain_text: 'X' }] } } };
  assert.equal(resumirPagina({ ...base, created_time: '2026-11-10T21:28:00.000Z' }).entrouEm, '2026-11-10T21:28:00.000Z');
  assert.equal(resumirPagina({ ...base, created_time: 'z', properties: { ...base.properties, 'Added At': { date: { start: '2026-11-10' } } } }).entrouEm, '2026-11-10');
});

const R = (semCapa, extra = {}) => ({
  slot: '19:15', horaBrt: '19:15', blog: { total: 2, itens: [] }, push: { ok: true },
  notion: { ativo: true, ok: true, semCapa, publicadosSemUrn: [], novosHoje: { total: 2 } }, ...extra,
});

test('alerta não vira problema, não dispara push e o "tudo certo" das 19:15 menciona os alertas', () => {
  const r = R([{ id: 'p', topic: 'Porto de Santos', severidade: 'alerta' }, { id: 'o', topic: 'Outlook NTLM', severidade: 'alerta' }]);
  r.problemas = calcularProblemas(r);
  r.alertas = calcularAlertas(r);
  assert.deepEqual(r.problemas, []);
  assert.equal(r.alertas.length, 2);
  const a = montarAlerta(r, { ALERTA_OK_DIARIO: 'on' });
  assert.equal(a.titulo, 'DSB: tudo certo hoje');
  assert.match(a.texto, /2 alerta\(s\)/);
  assert.equal(montarAlerta({ ...r, slot: '18:15' }, { ALERTA_OK_DIARIO: 'on' }), null);
});

test('problema de capa continua problema (e sem severidade gravada = problema)', () => {
  const r = R([{ id: 'v', topic: 'Velho', severidade: 'problema' }, { id: 'x', topic: 'Antigo' }]);
  assert.equal(calcularProblemas(r).filter((p) => p.startsWith('Fila: sem capa')).length, 2);
  assert.deepEqual(calcularAlertas(r), []);
});

test('painel: pill e seção Alertas em amarelo, linha da fila como Alerta', () => {
  const html = renderPainel({
    em: '2026-11-10T22:15:00Z', dataBrt: '2026-11-10', horaBrt: '19:15', slot: '19:15', ok: true, problemas: [],
    alertas: ['Fila: sem capa (aguarda a rodada de capas) — Porto de Santos'], flags: {},
    notion: { ativo: true, ok: true, novosHoje: { total: 2, aindaNovo: 2 }, semCapa: [{ id: 'p', topic: 'Porto de Santos', motivo: 'sem_capa', severidade: 'alerta' }], publicadosSemUrn: [], publicadosHoje: 0, aprovadosPorTipo: {}, fila: { total: 3 } },
  });
  assert.match(html, /Tudo certo/);
  assert.match(html, /class="pill warn">1 alerta\(s\)/);
  assert.match(html, /<h2>Alertas<\/h2>/);
  assert.match(html, /<span class="warn">Alerta<\/span>/);
  assert.match(html, /1 sem capa \(1 alerta, 0 problema\)/);
  assert.match(html, /--warn:/);
});
