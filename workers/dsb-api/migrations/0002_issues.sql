-- DSB · 0002 — issues and health checks
-- No problem stays a bare error: every rejected write, failed check or agent report becomes an
-- issue with a stage, a severity and a suggested action, and is closed automatically or with a note.
-- D1 limits compound SELECTs, so each check is its own view, registered in `health_checks`.

-- 1. Issues
CREATE TABLE issues (
  id               INTEGER PRIMARY KEY,
  fingerprint      TEXT NOT NULL,             -- check + entity (e.g. 'missing_cover:42'); groups repeats
  source           TEXT NOT NULL CHECK (source IN ('health','api','agent')),
                                              -- health = found by the sweep (closes by itself)
                                              -- api    = write rejected by dsb-api
                                              -- agent  = reported by a job or skill
  check_name       TEXT,                      -- originating check (source = health only)
  kind             TEXT NOT NULL,
  severity         TEXT NOT NULL CHECK (severity IN ('info','warning','error','critical')),
  stage            TEXT NOT NULL CHECK (stage IN ('curation','review','cover','approval',
                                                  'blog','linkedin','x','job','load','api')),
  post_id          INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  publication_id   INTEGER REFERENCES publications(id) ON DELETE SET NULL,
  job_run_id       INTEGER REFERENCES job_runs(id) ON DELETE SET NULL,
  agent            TEXT,
  summary          TEXT NOT NULL,
  detail           TEXT,                      -- JSON: rejected payload, SQL error, external response
  suggested_action TEXT,
  status           TEXT NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open','in_progress','resolved','ignored')),
  occurrences      INTEGER NOT NULL DEFAULT 1,
  first_seen_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_seen_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  notified_at      TEXT,                      -- when it went out in an alert
  resolved_at      TEXT,
  resolved_by      TEXT,                      -- 'auto' | agent | person
  resolution       TEXT,
  CHECK (status NOT IN ('resolved','ignored') OR (resolved_at IS NOT NULL AND resolution IS NOT NULL)),
  CHECK (source <> 'health' OR check_name IS NOT NULL)
);
-- One open issue per fingerprint; repeats only increment occurrences
CREATE UNIQUE INDEX ux_issues_open_fp ON issues(fingerprint) WHERE status IN ('open','in_progress');
CREATE INDEX ix_issues_status_sev ON issues(status, severity);
CREATE INDEX ix_issues_post ON issues(post_id);
CREATE INDEX ix_issues_check ON issues(check_name, status);

-- 2. Check registry (the sweep walks this table)
CREATE TABLE health_checks (
  name        TEXT PRIMARY KEY,
  view_name   TEXT NOT NULL UNIQUE,
  enabled     INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0,1)),
  description TEXT NOT NULL
);

-- 3. One view per check. Fixed columns:
--    fingerprint, kind, severity, stage, post_id, publication_id, summary, suggested_action

CREATE VIEW v_hc_missing_cover AS
SELECT 'missing_cover:' || p.id AS fingerprint, 'missing_cover' AS kind, 'error' AS severity, 'cover' AS stage,
       p.id AS post_id, NULL AS publication_id,
       'Approved without a cover: ' || p.topic AS summary,
       'Run dsb-covers for this post' AS suggested_action
FROM posts p WHERE p.status = 'approved' AND p.image_source = 'none';

CREATE VIEW v_hc_publication_failed AS
SELECT 'publication_failed:' || pub.id AS fingerprint, 'publication_failed' AS kind,
       CASE WHEN pub.attempts >= 3 THEN 'critical' ELSE 'error' END AS severity, pub.channel AS stage,
       pub.post_id AS post_id, pub.id AS publication_id,
       'Failed on ' || pub.channel || '/' || pub.lang || ' (' || pub.attempts || ' attempt(s)): '
         || IFNULL(pub.last_error, 'no detail') AS summary,
       'Fix the cause and claim the publication again, or mark it skipped with a reason' AS suggested_action
FROM publications pub WHERE pub.status = 'failed';

CREATE VIEW v_hc_publication_stuck AS
SELECT 'publication_stuck:' || pub.id AS fingerprint, 'publication_stuck' AS kind, 'error' AS severity,
       pub.channel AS stage, pub.post_id AS post_id, pub.id AS publication_id,
       'Pending for more than 2 h on ' || pub.channel || '/' || pub.lang AS summary,
       'Check whether it went out on the channel; if so record it as published with the URL, otherwise as failed' AS suggested_action
FROM publications pub
WHERE pub.status = 'pending' AND julianday('now') - julianday(pub.updated_at) > 2.0 / 24;

CREATE VIEW v_hc_linkedin_overdue AS
SELECT 'linkedin_overdue:' || p.id AS fingerprint, 'channel_overdue' AS kind, 'warning' AS severity,
       'linkedin' AS stage, p.id AS post_id, NULL AS publication_id,
       'On the blog for more than 1 day without LinkedIn: ' || p.topic AS summary,
       'Check the LinkedIn job (cover, post text, Composio limits)' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
WHERE julianday('now') - julianday(b.published_at) > 1
  AND NOT EXISTS (SELECT 1 FROM publications l WHERE l.post_id = p.id AND l.channel = 'linkedin');

CREATE VIEW v_hc_x_overdue AS
SELECT 'x_overdue:' || p.id AS fingerprint, 'channel_overdue' AS kind, 'warning' AS severity,
       'x' AS stage, p.id AS post_id, NULL AS publication_id,
       'On the blog for more than 2 days without X: ' || p.topic AS summary,
       'Check the X job (MINIPC built-in browser, @DSBriefing session)' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
WHERE julianday('now') - julianday(b.published_at) > 2
  AND NOT EXISTS (SELECT 1 FROM publications x WHERE x.post_id = p.id AND x.channel = 'x');

CREATE VIEW v_hc_missing_translation AS
SELECT 'missing_translation:' || p.id AS fingerprint, 'missing_translation' AS kind, 'warning' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'ES/EN not complete: ' || p.topic AS summary,
       'Publish the translations of this post' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
WHERE julianday('now') - julianday(b.published_at) > 1
  AND (SELECT COUNT(*) FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog'
         AND t.lang IN ('es','en') AND t.status IN ('published','skipped')) < 2;

CREATE VIEW v_hc_published_without_blog AS
SELECT 'published_without_blog:' || p.id AS fingerprint, 'status_mismatch' AS kind, 'error' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'Status published without a PT blog article: ' || p.topic AS summary,
       'Publish it on the blog or move it back to approved' AS suggested_action
FROM posts p
WHERE p.status = 'published'
  AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog'
                    AND b.lang = 'pt' AND b.status IN ('published','skipped'));

CREATE VIEW v_hc_blog_without_published AS
SELECT 'blog_without_published:' || p.id AS fingerprint, 'status_mismatch' AS kind, 'error' AS severity,
       'blog' AS stage, p.id AS post_id, NULL AS publication_id,
       'PT blog article published but status is ' || p.status || ': ' || p.topic AS summary,
       'Set the status to published' AS suggested_action
FROM posts p
JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
WHERE p.status <> 'published';

CREATE VIEW v_hc_missing_dedup_key AS
SELECT 'missing_dedup_key:' || p.id AS fingerprint, 'missing_dedup_key' AS kind, 'warning' AS severity,
       'curation' AS stage, p.id AS post_id, NULL AS publication_id,
       'No dedup key (CVE or URL): ' || p.topic AS summary,
       'Add the CVEs or the article''s specific URL with POST /posts/:id/keys' AS suggested_action
FROM posts p
WHERE p.status IN ('new','approved','published') AND p.follow_up_of IS NULL
  AND NOT EXISTS (SELECT 1 FROM post_keys k WHERE k.post_id = p.id);

CREATE VIEW v_hc_stale_approval AS
SELECT 'stale_approval:' || p.id AS fingerprint, 'stale_approval' AS kind, 'info' AS severity,
       'approval' AS stage, p.id AS post_id, NULL AS publication_id,
       'Approved more than 7 days ago and not published: ' || p.topic AS summary,
       'Publish, reprioritize or discard' AS suggested_action
FROM posts p
WHERE p.status = 'approved' AND p.approved_at IS NOT NULL
  AND julianday('now') - julianday(p.approved_at) > 7;

CREATE VIEW v_hc_approval_backlog AS
SELECT 'approval_backlog:' || p.type AS fingerprint, 'approval_backlog' AS kind, 'info' AS severity,
       'approval' AS stage, NULL AS post_id, NULL AS publication_id,
       COUNT(*) || ' approved posts of type ' || p.type AS summary,
       'Drain one post of this type per slot until it is back to 2' AS suggested_action
FROM posts p WHERE p.status = 'approved' GROUP BY p.type HAVING COUNT(*) >= 3;

CREATE VIEW v_hc_removal_pending AS
SELECT 'removal_pending:' || pub.id AS fingerprint, 'removal_pending' AS kind,
       CASE WHEN pub.attempts >= 3 THEN 'critical' ELSE 'error' END AS severity, pub.channel AS stage,
       pub.post_id AS post_id, pub.id AS publication_id,
       'Removed post still live on ' || pub.channel || '/' || pub.lang || ' (' || pub.attempts || ' attempt(s))'
         || IFNULL(': ' || pub.last_error, '') AS summary,
       'Run the takedown again from the queue app; on X delete the tweet and confirm it there' AS suggested_action
FROM publications pub
WHERE pub.status = 'removal_pending' AND (pub.attempts > 0 OR julianday('now') - julianday(pub.updated_at) > 1.0 / 24);

CREATE VIEW v_hc_job_stuck AS
SELECT 'job_stuck:' || j.id AS fingerprint, 'job_stuck' AS kind, 'error' AS severity,
       'job' AS stage, NULL AS post_id, NULL AS publication_id,
       'Job ' || j.job || ' started more than 1 h ago and never finished' AS summary,
       'Check the agent run; close the record as error with the reason' AS suggested_action
FROM job_runs j
WHERE j.status = 'running' AND julianday('now') - julianday(j.started_at) > 1.0 / 24;

CREATE VIEW v_hc_job_failed AS
SELECT 'job_failed:' || j.id AS fingerprint, 'job_failed' AS kind, 'error' AS severity,
       'job' AS stage, NULL AS post_id, NULL AS publication_id,
       'Job ' || j.job || ' finished with an error: ' || IFNULL(j.notes, 'no detail') AS summary,
       'Read the job run notes and fix the cause' AS suggested_action
FROM job_runs j
WHERE j.status = 'error' AND julianday('now') - julianday(j.started_at) <= 7;

INSERT INTO health_checks(name, view_name, description) VALUES
  ('missing_cover',          'v_hc_missing_cover',          'Approved without a cover'),
  ('publication_failed',     'v_hc_publication_failed',     'Failed publication on a channel'),
  ('publication_stuck',      'v_hc_publication_stuck',      'Publication claimed more than 2 h ago'),
  ('linkedin_overdue',       'v_hc_linkedin_overdue',       'On the blog for more than 1 day without LinkedIn'),
  ('x_overdue',              'v_hc_x_overdue',              'On the blog for more than 2 days without X'),
  ('missing_translation',    'v_hc_missing_translation',    'PT published more than 1 day ago without ES/EN'),
  ('published_without_blog', 'v_hc_published_without_blog', 'Status published without a PT blog article'),
  ('blog_without_published', 'v_hc_blog_without_published', 'PT blog article published with another status'),
  ('missing_dedup_key',      'v_hc_missing_dedup_key',      'Active post without a dedup key'),
  ('stale_approval',         'v_hc_stale_approval',         'Approved more than 7 days ago'),
  ('approval_backlog',       'v_hc_approval_backlog',       '3 or more approved posts of the same type'),
  ('removal_pending',        'v_hc_removal_pending',        'Removed post still live on a channel'),
  ('job_stuck',              'v_hc_job_stuck',              'Job running for more than 1 h'),
  ('job_failed',             'v_hc_job_failed',             'Job finished with an error (last 7 days)');

-- 4. Sweep (run by dsb-api from the dsb-auditor cron and at the end of every job):
--    for each enabled check, upsert its rows into `issues` (repeats increment occurrences,
--    ignored fingerprints are not reopened), then resolve the open issues of that check
--    that were not seen in this sweep. See src/issues.js.
