-- DSB · 0005 — stronger dedup (X-26).
-- 1. post_keys accepts a third kind, 'story': story:<root-entity>-<event>-<yyyy-mm>, the same fact under any URL.
--    SQLite cannot change a CHECK in place, so the table is rebuilt (only post_keys; nothing references it).
-- 2. Stored url keys follow the new normalization: no "www." host prefix and no AMP form ("/amp" path end).
--    UPDATE OR IGNORE keeps a key unchanged in the rare case its new form already belongs to another post.

-- The health-check view that reads post_keys is dropped first and recreated unchanged after the rebuild.
DROP VIEW IF EXISTS v_hc_missing_dedup_key;

CREATE TABLE post_keys_new (
  key        TEXT PRIMARY KEY,                -- 'cve:CVE-2026-93952' | 'url:<normalized url>' | 'story:<root>-<event>-<yyyy-mm>'
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('cve','url','story')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (substr(key, 1, length(kind) + 1) = kind || ':')
);
INSERT INTO post_keys_new (key, post_id, kind, created_at) SELECT key, post_id, kind, created_at FROM post_keys;
DROP TABLE post_keys;
ALTER TABLE post_keys_new RENAME TO post_keys;
CREATE INDEX ix_post_keys_post ON post_keys(post_id);

CREATE VIEW v_hc_missing_dedup_key AS
SELECT 'missing_dedup_key:' || p.id AS fingerprint, 'missing_dedup_key' AS kind, 'warning' AS severity,
       'curation' AS stage, p.id AS post_id, NULL AS publication_id,
       'No dedup key (CVE or URL): ' || p.topic AS summary,
       'Add the CVEs or the article''s specific URL with POST /posts/:id/keys' AS suggested_action
FROM posts p
WHERE p.status IN ('new','approved','published') AND p.follow_up_of IS NULL
  AND NOT EXISTS (SELECT 1 FROM post_keys k WHERE k.post_id = p.id);

UPDATE OR IGNORE post_keys SET key = 'url:https://' || substr(key, length('url:https://www.') + 1)
 WHERE kind = 'url' AND substr(key, 1, length('url:https://www.')) = 'url:https://www.';
UPDATE OR IGNORE post_keys SET key = 'url:http://' || substr(key, length('url:http://www.') + 1)
 WHERE kind = 'url' AND substr(key, 1, length('url:http://www.')) = 'url:http://www.';
UPDATE OR IGNORE post_keys SET key = substr(key, 1, length(key) - 4)
 WHERE kind = 'url' AND substr(key, -4) = '/amp' AND instr(key, '?') = 0;

-- 3. Generic-URL patterns follow the same normalization (they are compared with normalized URLs).
UPDATE ignored_url_patterns SET prefix = 'https://' || substr(prefix, length('https://www.') + 1)
 WHERE substr(prefix, 1, length('https://www.')) = 'https://www.';
