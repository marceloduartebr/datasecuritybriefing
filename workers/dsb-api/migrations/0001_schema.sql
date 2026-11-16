-- DSB · 0001 — core schema (D1)
-- The blog is the center: a post is published when its PT blog article is published;
-- LinkedIn and X are derived channels recorded in `publications`.
-- Dedup: each CVE and the normalized source URL become unique subject keys (`post_keys`);
-- a continuation of a subject enters only as `follow_up_of` of the original.
-- D1 enforces foreign keys by default. D1 limits long LIKE patterns, so URL checks use substr/instr.

-- 1. Posts (editorial status only: published = PT blog article published or skipped;
--    removed = pulled back after publication: every channel row goes to removal_pending, then removed)
CREATE TABLE posts (
  id             INTEGER PRIMARY KEY,
  notion_id      TEXT UNIQUE,                 -- 32-hex id of the source Notion page; NULL for posts born in D1
  topic          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new','approved','published','discarded','removed')),
  type           TEXT NOT NULL
                 CHECK (type IN ('incident','news','vulnerability')),
  country        TEXT
                 CHECK (country IS NULL OR country IN ('BR','MX','AR','CL','PE','PY','UY','CO','US','EU','LATAM','Global')),
  priority       TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal','high')),
  item_order     REAL,
  source_name    TEXT,
  source_url     TEXT NOT NULL,
  slug           TEXT UNIQUE,
  briefing_md    TEXT,                        -- canonical article body (PT)
  post_text      TEXT,                        -- approved LinkedIn draft
  image_source   TEXT NOT NULL DEFAULT 'none' CHECK (image_source IN ('og','generated','none')),
  image_url      TEXT CHECK (image_url IS NULL OR substr(image_url, 1, 33) = 'https://covers.duarte.top/covers/'),
  added_by       TEXT NOT NULL CHECK (added_by IN ('user','research','grok','claude')),
  added_at       TEXT NOT NULL,
  approved_at    TEXT,
  approval_notes TEXT,
  discard_reason TEXT,
  removed_at     TEXT,
  removal_reason TEXT,
  follow_up_of   INTEGER REFERENCES posts(id),
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK ((image_source = 'none' AND image_url IS NULL)
      OR (image_source <> 'none' AND image_url IS NOT NULL)),
  CHECK (follow_up_of IS NULL OR follow_up_of <> id),
  CHECK (status <> 'removed' OR removal_reason IS NOT NULL)
);
CREATE INDEX ix_posts_status_order ON posts(status, item_order);
CREATE INDEX ix_posts_type_status  ON posts(type, status);
CREATE INDEX ix_posts_added_at     ON posts(added_at);
CREATE INDEX ix_posts_follow_up    ON posts(follow_up_of);

CREATE TRIGGER trg_posts_updated_at AFTER UPDATE ON posts
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE posts SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

-- 2. Subject keys for dedup (a key belongs to exactly one post)
CREATE TABLE post_keys (
  key        TEXT PRIMARY KEY,                -- 'cve:CVE-2026-93952' | 'url:<normalized url>'
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('cve','url')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (substr(key, 1, length(kind) + 1) = kind || ':')
);
CREATE INDEX ix_post_keys_post ON post_keys(post_id);

-- Generic URLs that never become keys: a URL is generic when it starts with `prefix`
-- and, if `contains` is set, also contains that fragment.
CREATE TABLE ignored_url_patterns (
  prefix   TEXT NOT NULL,
  contains TEXT,
  note     TEXT,
  PRIMARY KEY (prefix, contains)
);

-- 3. Publications per channel and language (blog = primary; linkedin and x = derived)
CREATE TABLE publications (
  id           INTEGER PRIMARY KEY,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  channel      TEXT NOT NULL CHECK (channel IN ('blog','linkedin','x')),
  lang         TEXT NOT NULL DEFAULT 'pt' CHECK (lang IN ('pt','es','en')),
  status       TEXT NOT NULL CHECK (status IN ('pending','published','failed','skipped','removal_pending','removed')),
  url          TEXT,                          -- article, LinkedIn post or tweet
  external_id  TEXT,                          -- urn:li:share:… or tweet id
  body         TEXT,                          -- text actually published on the channel
  published_at TEXT,
  removed_at   TEXT,                          -- when the takedown was confirmed on the channel
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  agent        TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (post_id, channel, lang),
  CHECK (status <> 'published' OR published_at IS NOT NULL)
);
CREATE INDEX ix_publications_channel_status ON publications(channel, status);

CREATE TRIGGER trg_publications_updated_at AFTER UPDATE ON publications
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE publications SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = NEW.id;
END;

-- 4. Status history (written by dsb-api)
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

-- 5. Job runs
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

-- 6. Channel view for the apps
CREATE VIEW v_post_channels AS
SELECT p.id, p.topic, p.status, p.type, p.country, p.priority, p.item_order, p.slug, p.image_url,
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

INSERT INTO ignored_url_patterns(prefix, contains, note) VALUES
  ('https://www.cisa.gov/known-exploited-vulnerabilities-catalog', NULL, 'KEV catalog: source for many CVEs'),
  ('https://www.cisa.gov/news-events/alerts/', '/cisa-adds-', 'CISA "adds N KEVs" alert: several CVEs per page');
