-- DSB · schema v2 (D1) — blog no centro; LinkedIn e X derivam do blog publicado
-- Base de testes: dsb-staging (808d3914-2df5-4da9-aab7-1f19d51001d2)
-- Decisões: dedup por post_keys (CVE ou URL) + follow_up_of; descartado = bloqueio macio;
--           publicações por canal/idioma em publications.

-- D1 já aplica chaves estrangeiras por padrão (sem PRAGMA).

-- 1. Artigos (status apenas editorial: Publicado = publicado no blog)
CREATE TABLE posts (
  id             INTEGER PRIMARY KEY,
  notion_id      TEXT UNIQUE,                 -- 32 hex da página de origem; NULL para itens nascidos no D1
  topic          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'Novo'
                 CHECK (status IN ('Novo','Aprovado','Publicado','Descartado')),
  tipo           TEXT NOT NULL
                 CHECK (tipo IN ('Incidente','Notícia','Vulnerabilidades')),
  pais           TEXT
                 CHECK (pais IS NULL OR pais IN ('BR','MX','AR','CL','PE','PY','UY','CO','US','EU','LATAM','Global')),
  priority       TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal','Alta')),
  item_order     REAL,
  source_name    TEXT,
  source_url     TEXT NOT NULL,
  slug           TEXT UNIQUE,
  briefing_md    TEXT,                        -- corpo canônico do artigo (PT)
  post_text      TEXT,                        -- rascunho aprovado do texto do LinkedIn
  image_source   TEXT NOT NULL DEFAULT 'none' CHECK (image_source IN ('og','generated','none')),
  image_url      TEXT CHECK (image_url IS NULL OR substr(image_url, 1, 33) = 'https://covers.duarte.top/covers/'),
  added_by       TEXT NOT NULL
                 CHECK (added_by IN ('user','assistant_research','Grok_Assistant','Claude_Assistant')),
  added_at       TEXT NOT NULL,
  approved_at    TEXT,
  approval_notes TEXT,
  discard_reason TEXT,
  follow_up_of   INTEGER REFERENCES posts(id),
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK ((image_source = 'none' AND image_url IS NULL)
      OR (image_source <> 'none' AND image_url IS NOT NULL)),
  CHECK (follow_up_of IS NULL OR follow_up_of <> id)
);
CREATE INDEX ix_posts_status_order ON posts(status, item_order);
CREATE INDEX ix_posts_tipo_status  ON posts(tipo, status);
CREATE INDEX ix_posts_added_at     ON posts(added_at);
CREATE INDEX ix_posts_follow_up    ON posts(follow_up_of);

CREATE TRIGGER trg_posts_updated_at AFTER UPDATE ON posts
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE posts SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

-- 2. Chaves de assunto para dedup (uma chave pertence a um único item)
CREATE TABLE post_keys (
  key        TEXT PRIMARY KEY,                -- 'cve:CVE-2026-93952' | 'url:<url normalizada>'
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('cve','url')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (substr(key, 1, length(kind) + 1) = kind || ':')
);
CREATE INDEX ix_post_keys_post ON post_keys(post_id);

-- URLs genéricas que nunca viram chave.
-- Uma URL é genérica se começa com prefix e, quando contains não é NULL, contém esse trecho.
-- (D1 limita o tamanho de padrões LIKE; por isso a comparação é por substr/instr.)
CREATE TABLE ignored_url_patterns (
  prefix   TEXT NOT NULL,
  contains TEXT,
  note     TEXT,
  PRIMARY KEY (prefix, contains)
);

-- 3. Publicações por canal e idioma (blog = principal; linkedin e x = derivados)
CREATE TABLE publications (
  id           INTEGER PRIMARY KEY,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  channel      TEXT NOT NULL CHECK (channel IN ('blog','linkedin','x')),
  lang         TEXT NOT NULL DEFAULT 'pt' CHECK (lang IN ('pt','es','en')),
  status       TEXT NOT NULL CHECK (status IN ('pendente','publicado','falhou','pulado')),
  url          TEXT,                          -- artigo, post do LinkedIn ou tweet
  external_id  TEXT,                          -- urn:li:share:… ou id do tweet
  body         TEXT,                          -- texto efetivamente publicado no canal
  published_at TEXT,
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  agent        TEXT,                          -- Grok_Assistant | Claude_Assistant | user
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (post_id, channel, lang),
  CHECK (status <> 'publicado' OR published_at IS NOT NULL)
);
CREATE INDEX ix_publications_channel_status ON publications(channel, status);

CREATE TRIGGER trg_publications_updated_at AFTER UPDATE ON publications
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE publications SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

-- 4. Histórico de status (gravado pela dsb-api)
CREATE TABLE post_events (
  id          INTEGER PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  actor       TEXT NOT NULL,
  at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  notes       TEXT
);
CREATE INDEX ix_post_events_post ON post_events(post_id);

-- 5. Execuções de jobs (substitui backup_runs)
CREATE TABLE job_runs (
  id            INTEGER PRIMARY KEY,
  job           TEXT NOT NULL,
  agent         TEXT,
  started_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  finished_at   TEXT,
  status        TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','ok','error','skipped')),
  items_read    INTEGER,
  items_written INTEGER,
  notes         TEXT
);
CREATE INDEX ix_job_runs_job ON job_runs(job, started_at);

-- 6. Visão por canal para o app DSB
CREATE VIEW v_post_channels AS
SELECT p.id, p.topic, p.status, p.tipo, p.pais, p.priority, p.item_order, p.slug, p.image_url,
       MAX(CASE WHEN pub.channel='blog' AND pub.lang='pt' THEN pub.status END) AS blog_pt,
       MAX(CASE WHEN pub.channel='blog' AND pub.lang='pt' THEN pub.url END)    AS blog_url,
       MAX(CASE WHEN pub.channel='blog' AND pub.lang='es' THEN pub.status END) AS blog_es,
       MAX(CASE WHEN pub.channel='blog' AND pub.lang='en' THEN pub.status END) AS blog_en,
       MAX(CASE WHEN pub.channel='linkedin' THEN pub.status END)               AS linkedin,
       MAX(CASE WHEN pub.channel='linkedin' THEN pub.url END)                  AS linkedin_url,
       MAX(CASE WHEN pub.channel='x' THEN pub.status END)                      AS x,
       MAX(CASE WHEN pub.channel='x' THEN pub.url END)                         AS x_url
FROM posts p
LEFT JOIN publications pub ON pub.post_id = p.id
GROUP BY p.id;

-- 7. Padrões de URL genérica (fontes compartilhadas por vários artigos)
INSERT INTO ignored_url_patterns(prefix, contains, note) VALUES
  ('https://www.cisa.gov/known-exploited-vulnerabilities-catalog', NULL, 'Catálogo KEV: fonte de vários CVEs'),
  ('https://www.cisa.gov/news-events/alerts/', '/cisa-adds-', 'Alerta CISA "adds N KEVs": vários CVEs por página');

-- Teste de URL genérica:
-- SELECT EXISTS (SELECT 1 FROM ignored_url_patterns
--   WHERE substr(?1, 1, length(prefix)) = prefix
--     AND (contains IS NULL OR instr(?1, contains) > 0));
