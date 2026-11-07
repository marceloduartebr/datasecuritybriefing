/** Agenda documentada, não ativada: dias úteis 11:25 e 19:25 em America/Sao_Paulo (UTC−3, sem horário de verão desde 2019). */
export const CRON_DOCUMENTADO = '25 14,22 * * 1-5';

export const SITE = 'https://dsb.duarte.top';
export const TOPICO = 'edicao';
export const TTL_SEG = 6 * 3600;
export const JANELA_ATRASO_MS = 20 * 60 * 1000;
export const INTERVALO_CATALOGO_MS = 5 * 60 * 1000;
/** Cabe em 50 subrequests (Workers Free) com folga: 1 catálogo + 2 HEAD + 1 list + 12 gets + 4 envios + 4 deletes. */
export const LOTE_ENVIO = 4;
export const LOTE_KV = 12;
export const ORCAMENTO_SUBREQUESTS = 40;
export const TETO_SIMULACAO = 20;
export const TETO_SOMENTE = 3;
export const MAX_TENTATIVAS = 5;
export const LOCK_MS = 120_000;
export const STALE_ENVIO_MS = 120_000;
export const TIMEOUT_PUSH_MS = 10_000;
export const TETO_ATRASO_MS = 15 * 60 * 1000;
