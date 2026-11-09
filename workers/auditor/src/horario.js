import { OFFSET_BRT_MIN, SLOTS_BRT } from './constantes.js';

/** Converte um instante UTC para { data: 'AAAA-MM-DD', hhmm: 'HH:MM', diaSemana: 0-6 } em Brasília (UTC−3 fixo). */
export function emBrasilia(instante) {
  const ms = (instante instanceof Date ? instante.getTime() : Number(instante)) + OFFSET_BRT_MIN * 60000;
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return {
    data: `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`,
    hhmm: `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`,
    diaSemana: d.getUTCDay(),
  };
}

/** Slot de auditoria do tick do cron, ou null se o tick não é um dos horários (sai sem rede). */
export function slotDoTick(scheduledTime) {
  const b = emBrasilia(scheduledTime);
  if (b.diaSemana === 0 || b.diaSemana === 6) return null;
  return SLOTS_BRT.includes(b.hhmm) ? b.hhmm : null;
}

export function inicioDoDiaBrt(data) {
  return `${data}T00:00:00-03:00`;
}
