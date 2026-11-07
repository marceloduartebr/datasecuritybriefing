import { DurableObject } from 'cloudflare:workers';
import { normalizarItens } from '../../../src/lib/push-catalogo.mjs';
import { SITE } from './constantes.js';
import { logEvento } from './log.js';
import {
  criarSchema,
  definirEnvio as gravarEnvio,
  executarTick,
  importarHistorico,
  lerMeta,
  lerStatus,
  simularPlano,
} from './logica.js';
import { vistaInscricao } from './kv-lista.js';
import { baixarCatalogo, confirmarNoAr, enviarParaInscrito } from './rede.js';
import { adaptadorDo } from './sql.js';

const TETO_SIMULACAO = 300;

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
    if (r.ok && ligado === false) {
      try {
        await this.ctx.storage.deleteAlarm();
      } catch {
        /* sem alarme anterior */
      }
    }
    logEvento('envio', { resultado: r.ok ? r.envio : 'erro' });
    return r;
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
    let cursor;
    let truncado = false;
    do {
      const page = await this.env.DSB_PUSH.list({ prefix: 'sub:', cursor, limit: 100 });
      for (const chave of page.keys || []) {
        if (vistas.length >= TETO_SIMULACAO) {
          truncado = true;
          break;
        }
        vistas.push(vistaInscricao(chave.name, await this.env.DSB_PUSH.get(chave.name)));
      }
      cursor = page.list_complete || truncado ? undefined : page.cursor;
    } while (cursor);
    return { vistas, truncado };
  }

  async simular(corpo) {
    const db = this.db();
    const catalogo =
      corpo && corpo.catalogo
        ? normalizarItens(corpo.catalogo)
        : await baixarCatalogo(fetch, this.urlCatalogo());
    const { vistas, truncado } = await this.vistas();
    const plano = simularPlano({
      catalogo: catalogo.itens || [],
      inscritos: vistas,
      agora: new Date(),
      cutoff: lerMeta(db, 'cutoff'),
      envio: lerMeta(db, 'envio') === 'on',
      pushEnvio: this.env.PUSH_ENVIO === 'on',
    });
    logEvento('simular', { candidatos: plano.candidatos.length, enviaria: plano.enviaria });
    return { ...plano, truncado };
  }

  opcoes(pedido) {
    const env = this.env;
    return {
      agora: new Date(),
      origem: pedido && pedido.origem,
      programado: pedido && pedido.programado,
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
