import { AgendaPush } from './agenda.js';
import { logEvento } from './log.js';
import { tratarPedido } from './pedido.js';

export { AgendaPush };

export default {
  async fetch(request, env) {
    return tratarPedido(request, env, env.AGENDA.getByName('agenda'));
  },

  async scheduled(controller, env, ctx) {
    const programado = new Date(controller.scheduledTime).toISOString();
    logEvento('cron', { programado });
    ctx.waitUntil(
      env.AGENDA.getByName('agenda').tick({ origem: 'cron', programado }),
    );
  },
};
