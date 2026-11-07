import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { dataBrasilia, gerarCatalogo, normalizarItens, prefixoDoSlug, selecionarDoDia } from './push-catalogo.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dirBriefings = path.join(root, 'src/content/briefings');

function md(parcial) {
  return `---
title: ${parcial.title}
description: "não pode vazar"
pubDate: ${parcial.pubDate}
sourceName: "Fonte"
sourceUrl: "https://example.com/fonte-privada-nao"
cover: "https://covers.example/capa.jpg"
${parcial.tipo ? `tipo: ${parcial.tipo}` : ''}
${parcial.pais ? `pais: ${parcial.pais}` : ''}
notionUrl: "https://www.notion.so/segredo-interno"
tags: ["x"]
---

Corpo que não entra no catálogo.
`;
}

test('data de Brasília não segue o dia UTC', () => {
  assert.equal(dataBrasilia(new Date('2026-11-08T01:30:00.000Z')), '2026-11-07');
  assert.equal(dataBrasilia(new Date('2026-11-08T03:30:00.000Z')), '2026-11-08');
});

test('catálogo usa o prefixo do slug e guarda futuro para o bloqueio na seleção', () => {
  const agora = new Date('2026-11-07T15:00:00.000Z');
  const { itens, excluidos } = gerarCatalogo(
    [
      {
        slug: '2026-11-07-hoje',
        markdown: md({
          title: '"Notícia do dia"',
          pubDate: '2026-11-07T10:00:00-03:00',
          tipo: 'noticia',
          pais: 'br',
        }),
      },
      {
        slug: '2026-11-07-sem-meta',
        markdown: md({
          title: '"Sem tipo nem país"',
          pubDate: '2026-11-07T11:00:00-03:00',
        }),
      },
      {
        slug: '2026-11-07-futuro',
        markdown: md({
          title: '"Ainda não"',
          pubDate: '2026-11-07T23:00:00-03:00',
          tipo: 'incidente',
        }),
      },
      {
        slug: '2026-11-07-utc-ainda-dia-6',
        markdown: md({
          title: '"Virada"',
          pubDate: '2026-11-07T01:30:00.000Z',
          tipo: 'vulnerabilidades',
          pais: 'latam',
        }),
      },
    ],
    agora,
  );
  assert.deepEqual(
    itens.map((i) => i.slug),
    ['2026-11-07-futuro', '2026-11-07-hoje', '2026-11-07-sem-meta', '2026-11-07-utc-ainda-dia-6'],
  );
  assert.equal(excluidos.length, 0);
  for (const item of itens) assert.equal(item.data, prefixoDoSlug(item.slug));
  const hoje = itens.find((i) => i.slug === '2026-11-07-hoje');
  assert.equal(hoje.titulo, 'Notícia do dia');
  assert.equal(hoje.url, '/briefings/2026-11-07-hoje');
  assert.equal(hoje.data, '2026-11-07');
  assert.equal(hoje.tipo, 'noticia');
  assert.equal(hoje.pais, 'br');
  const sem = itens.find((i) => i.slug === '2026-11-07-sem-meta');
  assert.equal('tipo' in sem, false);
  assert.equal('pais' in sem, false);
  const virada = itens.find((i) => i.slug === '2026-11-07-utc-ainda-dia-6');
  assert.equal(virada.data, '2026-11-07');
  assert.notEqual(virada.data, dataBrasilia(new Date('2026-11-07T01:30:00.000Z')));
  const selecao = selecionarDoDia(itens, agora);
  assert.deepEqual(
    selecao.prontos.map((i) => i.slug),
    ['2026-11-07-hoje', '2026-11-07-sem-meta', '2026-11-07-utc-ainda-dia-6'],
  );
  assert.deepEqual(
    selecao.futuros.map((i) => i.slug),
    ['2026-11-07-futuro'],
  );
  const serial = JSON.stringify(itens);
  assert.equal(serial.includes('notion'), false);
  assert.equal(serial.includes('fonte-privada'), false);
  assert.equal(serial.includes('covers.example'), false);
  assert.equal(serial.includes('Corpo que'), false);
});

test('tipo inválido não vira incidente por omissão', () => {
  const { itens } = gerarCatalogo(
    [
      {
        slug: '2026-11-07-tipo-ruim',
        markdown: md({
          title: '"X"',
          pubDate: '2026-11-07T10:00:00-03:00',
          tipo: 'outro',
          pais: 'BR',
        }),
      },
    ],
    new Date('2026-11-07T15:00:00.000Z'),
  );
  assert.equal('tipo' in itens[0], false);
  assert.equal('pais' in itens[0], false);
});

test('normalizar descarta campos extras e url fora do site', () => {
  const r = normalizarItens({
    itens: [
      {
        slug: '2026-11-07-ok',
        titulo: 'Ok',
        url: '/briefings/2026-11-07-ok',
        data: '2026-11-07',
        publicadoEm: '2026-11-07T13:00:00.000Z',
        tipo: 'incidente',
        notionUrl: 'https://www.notion.so/nao',
        endpoint: 'https://fcm.googleapis.com/fcm/send/segredo',
      },
      {
        slug: '2026-11-07-externo',
        titulo: 'Não',
        url: 'https://evil.example/briefings/2026-11-07-externo',
        data: '2026-11-07',
        publicadoEm: '2026-11-07T13:00:00.000Z',
      },
    ],
  });
  assert.equal(r.itens.length, 1);
  assert.deepEqual(Object.keys(r.itens[0]).sort(), [
    'data',
    'publicadoEm',
    'slug',
    'tipo',
    'titulo',
    'url',
  ]);
});

test('corpus publicado não carrega dado interno e respeita o fuso', () => {
  const arquivos = readdirSync(dirBriefings)
    .filter((nome) => nome.endsWith('.md'))
    .map((nome) => ({
      slug: nome.slice(0, -3),
      markdown: readFileSync(path.join(dirBriefings, nome), 'utf8'),
    }));
  const { itens, excluidos } = gerarCatalogo(arquivos, new Date('2100-01-01T00:00:00.000Z'));
  assert.equal(excluidos.length, 0);
  assert.equal(itens.length, arquivos.length);
  const serial = JSON.stringify(itens);
  assert.equal(serial.includes('notion.so'), false);
  assert.equal(serial.includes('sourceUrl'), false);
  for (const item of itens) {
    assert.equal(item.url, `/briefings/${item.slug}`);
    assert.match(item.data, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(item.data, prefixoDoSlug(item.slug));
    assert.equal(item.data, item.slug.slice(0, 10));
  }
  const cisco = itens.find((i) => i.slug === '2026-09-24-cisco-seg-cve-2026-76461-kev');
  assert.equal(cisco.tipo, 'vulnerabilidades');
  assert.equal('pais' in cisco, false);
  const aero = itens.find((i) => i.slug === '2026-09-22-aeromexico-vazamento');
  assert.equal(aero.tipo, 'incidente');
  assert.equal(aero.pais, 'mx');
  assert.equal(aero.titulo.includes('Aeroméxico'), true);
});
