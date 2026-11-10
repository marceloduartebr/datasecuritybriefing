// Severidade de "item da fila sem capa" (Novo/Aprovado sem Image URL válida em covers.duarte.top).
// A rotina "Capas DSB via chat do projeto" roda em dias úteis às ~09:30 (Brasília) e esgota as capas
// pendentes; o publish das 10h aborta sem capa. Itens entram a qualquer hora e ficam sem capa
// legitimamente até a próxima rodada. Por isso:
// - ALERTA (amarelo, não dispara push nem estraga o "tudo certo"): padrão.
// - PROBLEMA (vermelho, dispara alerta): só em dia útil, a partir de HORA_LIMITE_GERACAO, para item que
//   já existia antes de HORA_INICIO_GERACAO do mesmo dia (a rodada deveria ter gerado a capa dele).
// Datas: Added At do Notion; sem ele, created_time da página. Sem nenhuma data: tratado como antigo.
import { OFFSET_BRT_MIN } from './constantes.js';
import { emBrasilia } from './horario.js';

export const HORA_INICIO_GERACAO = '09:30'; // início da rodada de capas (BRT)
export const HORA_LIMITE_GERACAO = '09:50'; // depois disto, item antigo sem capa vira problema (BRT)
/** Feriados (AAAA-MM-DD, BRT) em que a rodada não roda: sem capa fica só alerta. */
export const FERIADOS = [];

function instanteBrt(data, hhmm) {
  const off = -OFFSET_BRT_MIN / 60; // 3
  return new Date(`${data}T${hhmm}:00-${String(off).padStart(2, '0')}:00`).getTime();
}

export function diaUtil(b) {
  return b.diaSemana >= 1 && b.diaSemana <= 5 && !FERIADOS.includes(b.data);
}

/** 'problema' | 'alerta' para um item sem capa, dado quando entrou (ISO) e o instante da execução. */
export function severidadeSemCapa(entrouEm, agora) {
  const b = emBrasilia(agora);
  if (!diaUtil(b)) return 'alerta';
  const t = agora instanceof Date ? agora.getTime() : Number(agora);
  if (t < instanteBrt(b.data, HORA_LIMITE_GERACAO)) return 'alerta';
  const entrou = entrouEm ? Date.parse(entrouEm) : NaN;
  if (Number.isFinite(entrou) && entrou >= instanteBrt(b.data, HORA_INICIO_GERACAO)) return 'alerta';
  return 'problema';
}
