-- DSB · 0002 — pendências (issues) e verificações de saúde
-- Objetivo: nenhum problema fica só como erro; todo problema vira uma pendência com
-- etapa, gravidade e ação sugerida, e é fechada (automaticamente ou com nota).
-- Limites do D1 respeitados: cada verificação é uma view própria (sem UNION longo)
-- e não há padrões LIKE longos.

-- 1. Pendências
CREATE TABLE issues (
  id               INTEGER PRIMARY KEY,
  fingerprint      TEXT NOT NULL,             -- verificação + entidade (ex.: 'capa_ausente:42')
  source           TEXT NOT NULL CHECK (source IN ('health','api','agente')),
                                              -- health = varredura (fecha sozinha)
                                              -- api    = escrita recusada pela dsb-api
                                              -- agente = relatada por job/skill
  check_name       TEXT,                      -- verificação de origem (só source = health)
  kind             TEXT NOT NULL,
  severity         TEXT NOT NULL CHECK (severity IN ('info','aviso','erro','critico')),
  stage            TEXT NOT NULL CHECK (stage IN ('curadoria','avaliacao','capa','aprovacao',
                                                  'blog','linkedin','x','job','carga','api')),
  post_id          INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  publication_id   INTEGER REFERENCES publications(id) ON DELETE SET NULL,
  job_run_id       INTEGER REFERENCES job_runs(id) ON DELETE SET NULL,
  agent            TEXT,
  summary          TEXT NOT NULL,
  detail           TEXT,                      -- JSON: payload recusado, erro SQL, resposta externa
  suggested_action TEXT,
  status           TEXT NOT NULL DEFAULT 'aberto'
                   CHECK (status IN ('aberto','em_correcao','resolvido','ignorado')),
  occurrences      INTEGER NOT NULL DEFAULT 1,
  first_seen_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_seen_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  notified_at      TEXT,                      -- quando entrou num aviso ao Marcelo
  resolved_at      TEXT,
  resolved_by      TEXT,                      -- 'auto' | agente | 'user'
  resolution       TEXT,
  CHECK (status NOT IN ('resolvido','ignorado') OR (resolved_at IS NOT NULL AND resolution IS NOT NULL)),
  CHECK (source <> 'health' OR check_name IS NOT NULL)
);
-- Uma pendência aberta por fingerprint; repetições só incrementam occurrences
CREATE UNIQUE INDEX ux_issues_open_fp ON issues(fingerprint) WHERE status IN ('aberto','em_correcao');
CREATE INDEX ix_issues_status_sev ON issues(status, severity);
CREATE INDEX ix_issues_post ON issues(post_id);
CREATE INDEX ix_issues_check ON issues(check_name, status);

-- 2. Registro das verificações (a varredura percorre esta tabela)
CREATE TABLE health_checks (
  name        TEXT PRIMARY KEY,
  view_name   TEXT NOT NULL UNIQUE,
  enabled     INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0,1)),
  description TEXT NOT NULL
);

-- 3. Uma view por verificação. Colunas fixas:
--    fingerprint, kind, severity, stage, post_id, publication_id, summary, suggested_action

CREATE VIEW v_hc_capa_ausente AS
SELECT 'capa_ausente:' || p.id AS fingerprint, 'capa_ausente' AS kind, 'erro' AS severity, 'capa' AS stage,
       p.id AS post_id, NULL AS publication_id,
       'Aprovado sem capa: ' || p.topic AS summary,
       'Rodar dsb-covers para o item' AS suggested_action
FROM posts p WHERE p.status = 'Aprovado' AND p.image_source = 'none';

CREATE VIEW v_hc_publicacao_falhou AS
SELECT 'publicacao_falhou:' || pub.id AS fingerprint, 'publicacao_falhou' AS kind,
       CASE WHEN pub.attempts >= 3 THEN 'critico' ELSE 'erro' END AS severity, pub.channel AS stage,
       pub.post_id AS post_id, pub.id AS publication_id,
       'Falha em ' || pub.channel || '/' || pub.lang || ' (' || pub.attempts || ' tentativa(s)): '
         || IFNULL(pub.last_error, 'sem detalhe') AS summary,
       'Corrigir a causa e voltar a linha para pendente, ou marcar pulado com motivo' AS suggested_action
FROM publications pub WHERE pub.status = 'falhou';

CREATE VIEW v_hc_publicacao_travada AS
SELECT 'publicacao_travada:' || pub.id AS fingerprint, 'publicacao_travada' AS kind, 'erro' AS severity,
       pub.channel AS stage, pub.post_id AS post_id, pub.id AS publication_id,
       'Pendente há mais de 2 h em ' || pub.channel || '/' || pub.lang AS summary,
       'Conferir no canal se saiu; se saiu, gravar publicado com URL; se não, falhou' AS suggested_action
FROM publications pub
WHERE pub.status = 'pendente' AND julianday('now') - julianday(pub.updated_at) > 2.0 / 24;

CREATE VIEW v_hc_linkedin_atrasado AS
SELECT 'linkedin_atrasado:' || p.id AS fingerprint, 'canal_atrasado' AS kind, 'aviso' AS severity,
       'linkedin' AS stage, p.id AS post_id, NULL AS publication_id,
       'No blog há mais de 1 dia e sem LinkedIn: ' || p.topic AS summary,
       'Verificar o job do LinkedIn (capa, Post Text, limite do Composio)' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
WHERE julianday('now') - julianday(b.published_at) > 1
  AND NOT EXISTS (SELECT 1 FROM publications l WHERE l.post_id = p.id AND l.channel = 'linkedin');

CREATE VIEW v_hc_x_atrasado AS
SELECT 'x_atrasado:' || p.id AS fingerprint, 'canal_atrasado' AS kind, 'aviso' AS severity,
       'x' AS stage, p.id AS post_id, NULL AS publication_id,
       'No blog há mais de 2 dias e sem X: ' || p.topic AS summary,
       'Verificar o job do X (navegador do MINIPC, sessão da @DSBriefing)' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
WHERE julianday('now') - julianday(b.published_at) > 2
  AND NOT EXISTS (SELECT 1 FROM publications x WHERE x.post_id = p.id AND x.channel = 'x');

CREATE VIEW v_hc_traducao_ausente AS
SELECT 'traducao_ausente:' || p.id AS fingerprint, 'traducao_ausente' AS kind, 'aviso' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'Sem ES/EN completos: ' || p.topic AS summary,
       'Rodar a publicação das traduções do item' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
WHERE julianday('now') - julianday(b.published_at) > 1
  AND (SELECT COUNT(*) FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog'
         AND t.lang IN ('es','en') AND t.status IN ('publicado','pulado')) < 2;

CREATE VIEW v_hc_status_sem_blog AS
SELECT 'status_sem_blog:' || p.id AS fingerprint, 'status_inconsistente' AS kind, 'erro' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'Status Publicado sem blog PT: ' || p.topic AS summary,
       'Publicar no blog ou voltar o status para Aprovado' AS suggested_action
FROM posts p
WHERE p.status = 'Publicado'
  AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog'
                    AND b.lang = 'pt' AND b.status IN ('publicado','pulado'));

CREATE VIEW v_hc_blog_sem_status AS
SELECT 'blog_sem_status:' || p.id AS fingerprint, 'status_inconsistente' AS kind, 'erro' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'Blog PT publicado mas status ' || p.status || ': ' || p.topic AS summary,
       'Ajustar o status para Publicado' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
WHERE p.status <> 'Publicado';

CREATE VIEW v_hc_sem_chave AS
SELECT 'sem_chave:' || p.id AS fingerprint, 'sem_chave' AS kind, 'aviso' AS severity,
       'curadoria' AS stage, p.id AS post_id, NULL AS publication_id,
       'Sem chave de dedup (CVE ou URL): ' || p.topic AS summary,
       'Registrar o CVE ou a URL específica da matéria em post_keys' AS suggested_action
FROM posts p
WHERE p.status IN ('Novo','Aprovado','Publicado') AND p.follow_up_of IS NULL
  AND NOT EXISTS (SELECT 1 FROM post_keys k WHERE k.post_id = p.id);

CREATE VIEW v_hc_aprovado_parado AS
SELECT 'aprovado_parado:' || p.id AS fingerprint, 'aprovado_parado' AS kind, 'info' AS severity,
       'aprovacao' AS stage, p.id AS post_id, NULL AS publication_id,
       'Aprovado há mais de 7 dias sem publicar: ' || p.topic AS summary,
       'Publicar, repriorizar ou descartar' AS suggested_action
FROM posts p
WHERE p.status = 'Aprovado' AND p.approved_at IS NOT NULL
  AND julianday('now') - julianday(p.approved_at) > 7;

CREATE VIEW v_hc_fila_acumulada AS
SELECT 'fila_acumulada:' || p.tipo AS fingerprint, 'fila_acumulada' AS kind, 'info' AS severity,
       'aprovacao' AS stage, NULL AS post_id, NULL AS publication_id,
       COUNT(*) || ' Aprovados em ' || p.tipo AS summary,
       'O dreno deve publicar 1 item deste Tipo até voltar a 2' AS suggested_action
FROM posts p WHERE p.status = 'Aprovado' GROUP BY p.tipo HAVING COUNT(*) >= 3;

CREATE VIEW v_hc_job_travado AS
SELECT 'job_travado:' || j.id AS fingerprint, 'job_travado' AS kind, 'erro' AS severity,
       'job' AS stage, NULL AS post_id, NULL AS publication_id,
       'Job ' || j.job || ' iniciado e sem fim há mais de 1 h' AS summary,
       'Conferir a execução do agente; fechar o registro com error e o motivo' AS suggested_action
FROM job_runs j
WHERE j.status = 'running' AND julianday('now') - julianday(j.started_at) > 1.0 / 24;

CREATE VIEW v_hc_job_erro AS
SELECT 'job_erro:' || j.id AS fingerprint, 'job_erro' AS kind, 'erro' AS severity,
       'job' AS stage, NULL AS post_id, NULL AS publication_id,
       'Job ' || j.job || ' terminou com erro: ' || IFNULL(j.notes, 'sem detalhe') AS summary,
       'Ler notes do job_run e corrigir a causa' AS suggested_action
FROM job_runs j
WHERE j.status = 'error' AND julianday('now') - julianday(j.started_at) <= 7;

INSERT INTO health_checks(name, view_name, description) VALUES
  ('capa_ausente',       'v_hc_capa_ausente',       'Aprovado sem capa'),
  ('publicacao_falhou',  'v_hc_publicacao_falhou',  'Publicação em canal com falha'),
  ('publicacao_travada', 'v_hc_publicacao_travada', 'Publicação reservada há mais de 2 h'),
  ('linkedin_atrasado',  'v_hc_linkedin_atrasado',  'Blog há mais de 1 dia sem LinkedIn'),
  ('x_atrasado',         'v_hc_x_atrasado',         'Blog há mais de 2 dias sem X'),
  ('traducao_ausente',   'v_hc_traducao_ausente',   'PT há mais de 1 dia sem ES/EN'),
  ('status_sem_blog',    'v_hc_status_sem_blog',    'Status Publicado sem blog PT'),
  ('blog_sem_status',    'v_hc_blog_sem_status',    'Blog PT publicado com status diferente'),
  ('sem_chave',          'v_hc_sem_chave',          'Item ativo sem chave de dedup'),
  ('aprovado_parado',    'v_hc_aprovado_parado',    'Aprovado há mais de 7 dias'),
  ('fila_acumulada',     'v_hc_fila_acumulada',     '3 ou mais Aprovados no mesmo Tipo'),
  ('job_travado',        'v_hc_job_travado',        'Job sem fim há mais de 1 h'),
  ('job_erro',           'v_hc_job_erro',           'Job que terminou com erro (7 dias)');

-- 4. Varredura (executada pela dsb-api: no cron do Worker e ao fim de cada job)
--
-- ?1 = início da varredura (ISO UTC). Para cada verificação habilitada <name>/<view>:
--
-- INSERT INTO issues(fingerprint, source, check_name, kind, severity, stage, post_id,
--                    publication_id, summary, suggested_action, first_seen_at, last_seen_at)
-- SELECT h.fingerprint, 'health', '<name>', h.kind, h.severity, h.stage, h.post_id,
--        h.publication_id, h.summary, h.suggested_action, ?1, ?1
-- FROM <view> h
-- WHERE NOT EXISTS (SELECT 1 FROM issues i WHERE i.fingerprint = h.fingerprint AND i.status = 'ignorado')
-- ON CONFLICT(fingerprint) WHERE status IN ('aberto','em_correcao') DO UPDATE SET
--   occurrences = occurrences + 1, last_seen_at = ?1,
--   severity = excluded.severity, summary = excluded.summary;
--
-- Só para as verificações que rodaram sem erro nesta varredura, fecha o que não reapareceu:
-- UPDATE issues SET status = 'resolvido', resolved_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
--        resolved_by = 'auto', resolution = 'Condição deixou de ocorrer'
-- WHERE source = 'health' AND check_name = '<name>'
--   AND status IN ('aberto','em_correcao') AND last_seen_at < ?1;
