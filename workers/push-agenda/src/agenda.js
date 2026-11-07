import { DurableObject } from 'cloudflare:workers';
import { normalizarItens, selecionarDoDia } from '../../../src/lib/push-catalogo.mjs';
import { CRON_DOCUMENTADO, LOTE_ENVIO, LOTE_KV, ORCAMENTO_SUBREQUESTS, SITE, TETO_SIMULACAO } from './constantes.js';
import { medirCifra } from './crypto-push.js';
import { logEvento } from './log.js';
import {
  criarSchema,
  definirEnvio as gravarEnvio,
  definirFanout as gravarFanout,
  executarTick,
  importarHistorico,
  lerMeta,
  lerStatus,
  simularPlano,
} from './logica.js';
import { vistaInscricao } from './kv-lista.js';
import { baixarCatalogo, confirmarNoAr, enviarParaInscrito } from './rede.js';
import { adaptadorDo } from './sql.js';

export class AgendaPush extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      criarSchema(adaptadorDo(ctx.storage));
    });
  }

  db() {
    return adaptadorDo(this.ctx.storage);
  }

  urlCatalogo() {
    return this.env.CATALOGO_URL || `${SITE}/push/catalogo.json`;
  }

  async status() {
    return lerStatus(this.db(), { pushEnvio: this.env.PUSH_ENVIO === 'on' });
  }

  async definirEnvio(ligado) {
    const r = gravarEnvio(this.db(), ligado);
    if (r.ok && ligado === false) await this.apagarAlarme();
    logEvento('envio', { resultado: r.ok ? r.envio : 'erro' });
    return r;
  }

  async definirFanout(ligado) {
    const r = gravarFanout(this.db(), ligado);
    if (r.ok && ligado === false) await this.apagarAlarme();
    logEvento('fanout', { resultado: r.ok ? r.fanout : 'erro' });
    return r;
  }

  async apagarAlarme() {
    try {
      await this.ctx.storage.deleteAlarm();
    } catch {
      /* sem alarme anterior */
    }
  }

  async importar(corpo) {
    const r = importarHistorico(this.db(), corpo, new Date());
    logEvento('importar', {
      ok: Boolean(r.ok),
      concluidos: r.concluidos || 0,
      ja: r.ja_concluidos || 0,
      conflitos: r.conflitos ? r.conflitos.length : 0,
      erro: r.erro || null,
    });
    return r;
  }

  async vistas() {
    const vistas = [];
    const page = await this.env.DSB_PUSH.list({ prefix: 'sub:', limit: TETO_SIMULACAO });
    for (const chave of page.keys || []) {
      if (vistas.length >= TETO_SIMULACAO) break;
      vistas.push(vistaInscricao(chave.name, await this.env.DSB_PUSH.get(chave.name)));
    }
    const truncado = !page.list_complete || (page.keys || []).length > vistas.length;
    return { vistas, truncado, amostras: vistas.length };
  }

  async simular(corpo) {
    const db = this.db();
    const catalogo =
      corpo && corpo.catalogo
        ? normalizarItens(corpo.catalogo)
        : await baixarCatalogo(fetch, this.urlCatalogo());
    let inscritos = null;
    let truncado = false;
    if (corpo && corpo.comKv === true) {
      const lido = await this.vistas();
      inscritos = lido.vistas;
      truncado = lido.truncado;
    }
    const plano = simularPlano({
      catalogo: catalogo.itens || [],
      inscritos,
      agora: new Date(),
      cutoff: lerMeta(db, 'cutoff'),
      envio: lerMeta(db, 'envio') === 'on',
      pushEnvio: this.env.PUSH_ENVIO === 'on',
      fanout: lerMeta(db, 'fanout') === 'on',
    });
    logEvento('simular', {
      candidatos: plano.candidatos.length,
      enviaria: plano.enviaria,
      kv: Boolean(inscritos),
    });
    return { ...plano, truncado, enviou: false };
  }

  async medir(corpo) {
    const inicio = performance.now();
    const catalogo =
      corpo && corpo.catalogo
        ? normalizarItens(corpo.catalogo)
        : await baixarCatalogo(fetch, this.urlCatalogo());
    const selecao = selecionarDoDia(catalogo.itens || [], new Date());
    let kv = { lido: false, amostras: 0, truncado: false };
    if (corpo && corpo.comKv === true) {
      const lido = await this.vistas();
      kv = { lido: true, amostras: lido.amostras, truncado: lido.truncado };
    }
    const cifra = await medirCifra();
    const db = this.db();
    const resposta = {
      ok: true,
      enviou: false,
      enviaria: false,
      hoje: selecao.hoje,
      prontos: selecao.prontos.map((item) => item.slug),
      futuros: selecao.futuros.map((item) => item.slug),
      catalogoErro: catalogo.erro || null,
      kv,
      cifraMs: cifra.cifraMs,
      duracaoMs: Math.max(0, Math.round(performance.now() - inicio)),
      loteEnvio: LOTE_ENVIO,
      loteKv: LOTE_KV,
      orcamentoSubrequests: ORCAMENTO_SUBREQUESTS,
      cronDocumentado: CRON_DOCUMENTADO,
      cronAtivoNoArquivo: false,
      envio: lerMeta(db, 'envio') === 'on' ? 'on' : 'off',
      fanout: lerMeta(db, 'fanout') === 'on' ? 'on' : 'off',
      pushEnvio: this.env.PUSH_ENVIO === 'on' ? 'on' : 'off',
      viabilidade: 'nao_medida_na_conta',
    };
    logEvento('medir', {
      cifraMs: resposta.cifraMs,
      duracaoMs: resposta.duracaoMs,
      prontos: resposta.prontos.length,
      kv: kv.lido,
    });
    return resposta;
  }

  opcoes(pedido) {
    const env = this.env;
    return {
      agora: new Date(),
      origem: pedido && pedido.origem,
      programado: pedido && pedido.programado,
      somente: pedido && pedido.somente,
      slug: pedido && pedido.slug,
      pushEnvio: env.PUSH_ENVIO,
      vapidDisponivel: async () => Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY),
      catalogo: () => baixarCatalogo(fetch, this.urlCatalogo()),
      confirmarNoAr: (caminho) => confirmarNoAr(fetch, caminho),
      pagina: async ({ cursor, limite }) => {
        const page = await env.DSB_PUSH.list({ prefix: 'sub:', cursor, limit: limite });
        const chaves = [];
        for (const chave of page.keys || []) {
          chaves.push(vistaInscricao(chave.name, await env.DSB_PUSH.get(chave.name)));
        }
        return {
          chaves,
          cursor: page.list_complete ? '' : page.cursor || '',
          completo: Boolean(page.list_complete),
        };
      },
      carregar: async (chaves) => {
        const vistas = [];
        for (const id of chaves) {
          const bruto = await env.DSB_PUSH.get(id);
          if (typeof bruto !== 'string') vistas.push({ inscrito: id, ausente: true });
          else vistas.push(vistaInscricao(id, bruto));
        }
        return vistas;
      },
      apagar: async (inscrito) => {
        if (typeof inscrito === 'string' && inscrito.startsWith('sub:')) {
          await env.DSB_PUSH.delete(inscrito);
        }
      },
      enviar: async (inscrito, payload) => {
        const bruto = await env.DSB_PUSH.get(inscrito);
        if (typeof bruto !== 'string') return { classe: 'permanente', status: null };
        let registro;
        try {
          registro = JSON.parse(bruto);
        } catch {
          return { classe: 'permanente', status: null };
        }
        try {
          return await enviarParaInscrito({
            registro,
            payload,
            vapid: {
              publicKey: env.VAPID_PUBLIC_KEY,
              privateKey: env.VAPID_PRIVATE_KEY,
              subject: env.VAPID_SUBJECT || 'https://dsb.duarte.top/sobre',
            },
            agora: new Date(),
            fetchImpl: fetch,
          });
        } catch {
          return { classe: 'transiente' };
        }
      },
    };
  }

  async tick(pedido = {}) {
    const resultado = await executarTick(this.db(), this.opcoes(pedido));
    logEvento('tick', {
      motivo: resultado.motivo,
      enviados: resultado.enviados || 0,
      expirados: resultado.expirados || 0,
      transientes: resultado.transientes || 0,
      esgotados: resultado.esgotados || 0,
      continuar: Boolean(resultado.continuar),
    });
    if (resultado.tocarAlarme === false) return resultado;
    try {
      if (resultado.continuar && resultado.esperarMs) {
        await this.ctx.storage.setAlarm(Date.now() + resultado.esperarMs);
      } else {
        await this.ctx.storage.deleteAlarm();
      }
    } catch {
      /* o SQLite continua sendo a fonte do que falta enviar */
    }
    return resultado;
  }

  async alarm() {
    await this.tick({ origem: 'alarme' });
  }
}
