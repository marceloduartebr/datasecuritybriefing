/** Auditor DSB: só leitura. Nunca publica, nunca muda Notion, nunca faz fan-out de push. */
export const SITE = 'https://dsb.duarte.top';
export const CAPAS_HOST = 'covers.duarte.top';
export const REPO = 'marceloduartebr/datasecuritybriefing';
export const NOTION_DS = 'd69d8348-e339-459d-86a1-935e6ce7fded';
export const NOTION_VERSAO = '2025-09-03';
export const UA = 'DSB-Auditor/1.0';

/** Horários de auditoria (America/Sao_Paulo, UTC−3 fixo, dias úteis). Cron: "15,30,50 11-22 * * 1-5". */
export const SLOTS_BRT = ['08:30', '09:50', '10:15', '11:15', '18:15', '19:15'];
export const CRON = '15,30,50 11-22 * * 1-5';
export const OFFSET_BRT_MIN = -180;

/** Orçamento de subrequests externas (Workers Free = 50 por invocação). */
export const TETO_SLUGS_BLOG = 5; // 5 x (3 páginas + 1 md + 1 capa) = 25
export const TETO_CAPAS_FILA = 12;
export const ORCAMENTO = 45;
export const TIMEOUT_MS = 8000;

/** Allowlist de inscrições do Marcelo (prefixo do hash sub:<64 hex>). Nada fora disso recebe alerta. */
export const ALLOWLIST_PREFIXOS = ['568add3d', 'd48327b1'];
export const HISTORICO_MAX = 30;
