/**
 * Checagem do "quadrado escuro" atrás do escudo nas capas 1200×630 (dsb-covers v1.8: marca 105 px em 45,35).
 * Quando o logo é colado sem a máscara alfa, o fundo escondido do PNG (≈ RGB 11,12,16) vira um quadrado
 * opaco em (45,35)–(150,140). Para caber no limite de CPU do plano Free, não decodificamos a imagem toda:
 * lemos só os coeficientes DC (média de cada bloco 8×8) da luminância, e só as linhas de MCU do topo.
 * Suporta JPEG baseline (SOF0/1) e progressivo (SOF2, 1º scan DC). Outros formatos/dimensões: pula.
 */

export const QUADRADO = Object.freeze({ largura: 1200, altura: 630, x0: 45, y0: 35, x1: 150, y1: 140 });

// Blocos 8×8 (coluna, linha) usados na medição — todos inteiros dentro/fora do quadrado e longe do escudo
// (escudo dourado ocupa ~ (62,37)–(132,135)).
const COLS_DENTRO = [6, 17]; // x 48–55 e 136–143 (faixas laterais internas do quadrado)
const COLS_FORA = [3, 4, 19, 20]; // x 24–39 e 152–167
const LINHAS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // y 40–135
const LINHAS_DECODIFICAR = 17 * 8; // precisa dos blocos até y=135

class LeitorBits {
  constructor(d, pos) { this.d = d; this.pos = pos; this.buf = 0; this.n = 0; this.fim = false; }
  bit() {
    if (this.n === 0) {
      if (this.pos >= this.d.length) { this.fim = true; return 0; }
      let b = this.d[this.pos++];
      if (b === 0xff) {
        const nx = this.d[this.pos];
        if (nx === 0) this.pos++;
        else if (nx >= 0xd0 && nx <= 0xd7) { /* RST tratado fora */ }
        else { this.fim = true; return 0; }
      }
      this.buf = b; this.n = 8;
    }
    this.n--;
    return (this.buf >> this.n) & 1;
  }
  bits(k) { let v = 0; for (let i = 0; i < k; i++) v = (v << 1) | this.bit(); return v; }
  reiniciar() {
    // alinha ao byte e consome o marcador RSTn
    this.n = 0;
    while (this.pos + 1 < this.d.length && !(this.d[this.pos] === 0xff && this.d[this.pos + 1] >= 0xd0 && this.d[this.pos + 1] <= 0xd7)) this.pos++;
    this.pos += 2;
  }
}

function montarHuffman(contagens, simbolos) {
  // Huffman canônico (JPEG F.2.2.3): maxcode/valptr por comprimento, sem Map.
  const maxcode = new Int32Array(18).fill(-1), valptr = new Int32Array(17), mincode = new Int32Array(17);
  let codigo = 0, k = 0;
  for (let len = 1; len <= 16; len++) {
    const n = contagens[len - 1];
    if (n) { valptr[len] = k; mincode[len] = codigo; codigo += n; k += n; maxcode[len] = codigo - 1; }
    codigo <<= 1;
  }
  return { maxcode, valptr, mincode, simbolos: Uint8Array.from(simbolos) };
}

function decodificarSimbolo(lb, h) {
  let c = 0;
  for (let len = 1; len <= 16; len++) {
    c = (c << 1) | lb.bit();
    if (c <= h.maxcode[len]) return h.simbolos[h.valptr[len] + c - h.mincode[len]];
    if (lb.fim) return -1;
  }
  return -1;
}

function estender(v, t) { return t === 0 ? 0 : (v < (1 << (t - 1)) ? v - (1 << t) + 1 : v); }

/**
 * Médias de luminância (0–255) dos blocos 8×8 das primeiras `linhasPx` linhas.
 * Retorna { largura, altura, blocosX, linhasBloco, y: Float32Array } ou { erro }.
 */
export function mediasLumaTopo(bytes, linhasPx = LINHAS_DECODIFICAR, exigir = null) {
  const d = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (d[0] !== 0xff || d[1] !== 0xd8) return { erro: 'nao_jpeg' };
  const qt = [], hdc = [], hac = [];
  let sof = null, dri = 0, p = 2;
  while (p + 4 <= d.length) {
    if (d[p] !== 0xff) { p++; continue; }
    const m = d[p + 1];
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7) || m === 0xff) { p += m === 0xff ? 1 : 2; continue; }
    const len = (d[p + 2] << 8) | d[p + 3];
    const s = p + 4, e = p + 2 + len;
    if (e > d.length) return { erro: 'truncado' };
    if (m === 0xdb) {
      for (let q = s; q < e;) {
        const pq = d[q] >> 4, tq = d[q] & 15;
        qt[tq] = pq ? (d[q + 1] << 8) | d[q + 2] : d[q + 1]; // só o Q[0] (DC)
        q += 1 + (pq ? 128 : 64);
      }
    } else if (m === 0xc0 || m === 0xc1 || m === 0xc2) {
      const altura = (d[s + 1] << 8) | d[s + 2], largura = (d[s + 3] << 8) | d[s + 4], nc = d[s + 5];
      const comps = [];
      for (let i = 0; i < nc; i++) comps.push({ id: d[s + 6 + i * 3], h: d[s + 7 + i * 3] >> 4, v: d[s + 7 + i * 3] & 15, tq: d[s + 8 + i * 3] });
      sof = { progressivo: m === 0xc2, altura, largura, comps };
      // Dimensão fora do padrão: devolve logo, sem gastar CPU com o scan.
      if (exigir && (largura !== exigir.largura || altura !== exigir.altura)) return { largura, altura, pulado: true };
    } else if (m >= 0xc3 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { erro: 'sof_nao_suportado' };
    } else if (m === 0xc4) {
      for (let q = s; q < e;) {
        const tc = d[q] >> 4, th = d[q] & 15;
        const cont = Array.from(d.subarray(q + 1, q + 17));
        const tot = cont.reduce((a, b) => a + b, 0);
        const tab = montarHuffman(cont, d.subarray(q + 17, q + 17 + tot));
        (tc === 0 ? hdc : hac)[th] = tab;
        q += 17 + tot;
      }
    } else if (m === 0xdd) {
      dri = (d[s] << 8) | d[s + 1];
    } else if (m === 0xda) {
      if (!sof) return { erro: 'sem_sof' };
      const ns = d[s];
      const sc = [];
      for (let i = 0; i < ns; i++) sc.push({ id: d[s + 1 + i * 2], td: d[s + 2 + i * 2] >> 4, ta: d[s + 2 + i * 2] & 15 });
      const k = s + 1 + ns * 2;
      const ss = d[k], se = d[k + 1], ah = d[k + 2] >> 4, al = d[k + 2] & 15;
      if (sof.progressivo && !(ss === 0 && se === 0 && ah === 0)) return { erro: 'sem_scan_dc' };
      return decodificarScan(d, e, sof, sc, { hdc, hac, qt, dri, al: sof.progressivo ? al : 0, progressivo: sof.progressivo }, linhasPx);
    }
    p = e;
  }
  return { erro: 'sem_scan' };
}

function decodificarScan(d, pos, sof, sc, t, linhasPx) {
  const hmax = Math.max(...sof.comps.map((c) => c.h)), vmax = Math.max(...sof.comps.map((c) => c.v));
  const comps = sc.map((s) => ({ ...sof.comps.find((c) => c.id === s.id), ...s, pred: 0 }));
  if (comps.some((c) => !c.h || !t.hdc[c.td] || (!t.progressivo && !t.hac[c.ta]))) return { erro: 'tabela' };
  const luma = sof.comps[0];
  const y0 = comps.find((c) => c.id === luma.id);
  if (!y0 || t.qt[luma.tq] === undefined) return { erro: 'sem_luma' };
  const q0 = t.qt[luma.tq];
  const interleaved = comps.length > 1;
  const blocosX = Math.ceil(Math.ceil(sof.largura * luma.h / hmax) / 8);
  const linhasBloco = Math.min(Math.ceil(linhasPx / 8), Math.ceil(Math.ceil(sof.altura * luma.v / vmax) / 8));
  const out = new Float32Array(blocosX * linhasBloco).fill(NaN);
  const lb = new LeitorBits(d, pos);
  const mcusX = interleaved ? Math.ceil(sof.largura / (8 * hmax)) : blocosX;
  const mcusY = interleaved ? Math.ceil(sof.altura / (8 * vmax)) : Math.ceil(Math.ceil(sof.altura * luma.v / vmax) / 8);
  const linhasMcu = interleaved ? Math.ceil(linhasBloco / luma.v) : linhasBloco;
  let mcu = 0;
  for (let my = 0; my < Math.min(mcusY, linhasMcu); my++) {
    for (let mx = 0; mx < mcusX; mx++) {
      if (t.dri && mcu > 0 && mcu % t.dri === 0) { lb.reiniciar(); for (const c of comps) c.pred = 0; }
      mcu++;
      for (const c of comps) {
        const nb = interleaved ? c.h * c.v : 1;
        for (let b = 0; b < nb; b++) {
          const tam = decodificarSimbolo(lb, t.hdc[c.td]);
          if (tam < 0 || lb.fim) return { erro: 'dados_incompletos' };
          c.pred += estender(lb.bits(tam), tam);
          if (!t.progressivo) {
            // pula os AC
            for (let kk = 1; kk < 64;) {
              const rs = decodificarSimbolo(lb, t.hac[c.ta]);
              if (rs < 0) return { erro: 'dados_incompletos' };
              const r = rs >> 4, sz = rs & 15;
              if (sz === 0) { if (r === 15) { kk += 16; continue; } break; }
              kk += r; lb.bits(sz); kk++;
            }
          }
          if (c.id === luma.id) {
            const bx = interleaved ? mx * c.h + (b % c.h) : mx;
            const by = interleaved ? my * c.v + Math.floor(b / c.h) : my;
            if (bx < blocosX && by < linhasBloco) out[by * blocosX + bx] = Math.max(0, Math.min(255, ((c.pred << t.al) * q0) / 8 + 128));
          }
        }
      }
    }
  }
  return { largura: sof.largura, altura: sof.altura, blocosX, linhasBloco, y: out, progressivo: t.progressivo };
}

function estat(v) {
  const n = v.length; const m = v.reduce((a, b) => a + b, 0) / n;
  return { media: m, min: Math.min(...v), max: Math.max(...v) };
}

/**
 * Analisa bytes de uma capa. Retorna { positivo:boolean, pulado?:motivo, dentro, fora }.
 * Positivo = faixas internas do quadrado quase uniformes, escuras (Y ≈ 12, cor do fundo do logo 11,12,16)
 * e o entorno imediato claramente mais claro (o quadrado "destoa").
 */
export function analisarQuadrado(bytes) {
  const r = mediasLumaTopo(bytes, LINHAS_DECODIFICAR, QUADRADO);
  if (r.erro) return { positivo: false, pulado: r.erro };
  if (r.largura !== QUADRADO.largura || r.altura !== QUADRADO.altura) return { positivo: false, pulado: `dimensao_${r.largura}x${r.altura}` };
  const pega = (cols) => {
    const v = [];
    for (const l of LINHAS) for (const c of cols) v.push(r.y[l * r.blocosX + c]);
    return v;
  };
  const dentro = pega(COLS_DENTRO), foraE = pega(COLS_FORA.slice(0, 2)), foraD = pega(COLS_FORA.slice(2));
  if ([...dentro, ...foraE, ...foraD].some((x) => Number.isNaN(x))) return { positivo: false, pulado: 'dados_incompletos' };
  const sd = estat(dentro), se = estat(foraE), sdr = estat(foraD);
  const uniforme = sd.max - sd.min <= 6;
  const corDoLogo = sd.media >= 6 && sd.media <= 20; // Y de (11,12,16) ≈ 12
  const destoa = se.media - sd.media >= 4 && sdr.media - sd.media >= 4;
  const arred = (s) => ({ media: Math.round(s.media * 10) / 10, min: Math.round(s.min), max: Math.round(s.max) });
  return { positivo: uniforme && corDoLogo && destoa, dentro: arred(sd), foraEsq: arred(se), foraDir: arred(sdr), ...(r.progressivo ? {} : { baseline: true }) };
}

// ---------- Integração com a auditoria (orçamento de rede + cache no KV) ----------

export const TETO_QUADRADO = 3; // downloads/leituras novas por rodada (CPU e subrequests do plano Free)
export const DIAS_RECENTES = 3; // publicações do blog dos últimos N dias (inclui hoje)
export const BYTES_RANGE = 65535; // os DCs ficam no começo do arquivo (progressivo: 1º scan)
const TTL_NEGATIVO = 2 * 86400; // capa regerada no mesmo URL: a chave leva o ETag quando há HEAD; sem ele, expira em 2 dias
const TTL_POSITIVO = 6 * 3600; // positivo é reavaliado (a capa pode ser regerada no mesmo URL)
const TTL_CAPA_SLUG = 6 * 3600;
const PREFIXO = 'quadrado:v1:';

async function kvJson(kv, chave) {
  if (!kv) return null;
  try { return await kv.get(chave, 'json'); } catch { return null; }
}
async function kvPut(kv, chave, valor, ttl) {
  if (!kv) return;
  try { await kv.put(chave, JSON.stringify(valor), { expirationTtl: ttl }); } catch { /* cache é opcional */ }
}

/**
 * alvos: [{ url?, origem: 'fila'|'blog', id?, topic?, slug?, mdUrl? }]. Quem não tem `url` mas tem `mdUrl`
 * (publicações recentes do blog) tem a capa lida do frontmatter (1 subrequest, cache de 6 h por slug).
 * deps: { capaValida, lerFrontmatter, lerTexto }.
 */
export async function checarQuadrados(rede, kv, alvos, deps, { teto = TETO_QUADRADO, folga = 2 } = {}) {
  const out = { ativo: true, checadas: 0, doCache: 0, novas: 0, puladas: 0, pendentes: 0, positivas: [] };
  const vistos = new Set();
  let novas = 0;
  const podeRede = () => novas < teto && rede.estado.orcamento - rede.estado.usadas > folga;
  for (const a of alvos) {
    let url = a.url || null;
    if (!url && a.mdUrl && a.slug) {
      const c = await kvJson(kv, `${PREFIXO}capa:${a.slug}`);
      if (c && 'url' in c) url = c.url;
      else if (podeRede()) {
        novas++;
        const res = await rede.pedir(a.mdUrl);
        const fm = res.ok ? deps.lerFrontmatter(await deps.lerTexto(res)) : null;
        url = fm && fm.cover ? fm.cover : null;
        if (res.ok) await kvPut(kv, `${PREFIXO}capa:${a.slug}`, { url }, TTL_CAPA_SLUG);
      } else { out.pendentes++; continue; }
    }
    if (!url || !deps.capaValida(url) || vistos.has(url)) continue;
    vistos.add(url);
    const chave = PREFIXO + url + (a.versao ? `#${a.versao}` : '');
    let r = await kvJson(kv, chave);
    if (r) out.doCache++;
    else if (podeRede()) {
      novas++;
      const res = await rede.pedir(url, { headers: { Range: `bytes=0-${BYTES_RANGE}` } });
      if (!res.ok) { out.puladas++; continue; } // 200 ou 206; erro de rede não vai para o cache
      let bytes;
      try { bytes = new Uint8Array(await res.arrayBuffer()); } catch { out.puladas++; continue; }
      r = analisarQuadrado(bytes);
      await kvPut(kv, chave, r, r.positivo ? TTL_POSITIVO : TTL_NEGATIVO);
      out.novas++;
      if (r.baseline) novas = teto; // JPEG baseline custa ~3–7 ms de CPU: no máximo 1 por rodada
    } else { out.pendentes++; continue; }
    out.checadas++;
    if (r.pulado) out.puladas++;
    if (r.positivo) {
      out.positivas.push({ origem: a.origem, slug: a.slug || null, id: a.id || null, topic: a.topic || null, url, dentro: r.dentro, foraEsq: r.foraEsq, foraDir: r.foraDir });
    }
  }
  return out;
}
