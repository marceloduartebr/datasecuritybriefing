-- DSB · 0008 — the publishing plan replaces the approval backlog check (2026-11-20).
-- approval_backlog (3+ approved of one type) was the old 'excess' signal; the Flow tab now decides how many go out per
-- round. In its place, going_stale opens a warning for an approved post with no blog article yet whose age in business
-- days (Mon–Fri, Brasília dates, counted from the day after it was curated) reached the plan's limit for its type.
-- High priority posts (Publish now) are left out, as in GET /plan/round. Same rule as src/plan.js businessDaysSince.

DELETE FROM health_checks WHERE name = 'approval_backlog';
DROP VIEW IF EXISTS v_hc_approval_backlog;
UPDATE issues
   SET status = 'resolved', resolved_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), resolved_by = 'migration 0008',
       resolution = 'Check retired: replaced by the publishing plan (DSB Admin, Flow) and the going_stale check'
 WHERE kind = 'approval_backlog' AND status IN ('open', 'in_progress');

CREATE VIEW v_hc_going_stale AS
WITH lim AS (SELECT json_extract(plan, '$.stale_business_days') AS d FROM publish_plan WHERE id = 1),
waiting AS (
  SELECT p.id, p.type, p.topic,
         CAST(julianday(date('now', '-3 hours')) - julianday(date(p.added_at, '-3 hours')) AS INTEGER) AS n,
         CAST(strftime('%w', date(p.added_at, '-3 hours')) AS INTEGER) AS w0
  FROM posts p
  WHERE p.status = 'approved' AND IFNULL(p.priority, '') <> 'high'
    AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt')
),
aged AS (SELECT w.*, (w.n / 7) * 5 + ((n % 7) >= 1 AND ((w0 + 1) % 7) NOT IN (0, 6)) + ((n % 7) >= 2 AND ((w0 + 2) % 7) NOT IN (0, 6)) + ((n % 7) >= 3 AND ((w0 + 3) % 7) NOT IN (0, 6)) + ((n % 7) >= 4 AND ((w0 + 4) % 7) NOT IN (0, 6)) + ((n % 7) >= 5 AND ((w0 + 5) % 7) NOT IN (0, 6)) + ((n % 7) >= 6 AND ((w0 + 6) % 7) NOT IN (0, 6)) AS bd FROM waiting w)
SELECT 'going_stale:' || a.id AS fingerprint, 'going_stale' AS kind, 'warning' AS severity,
       'approval' AS stage, a.id AS post_id, NULL AS publication_id,
       'Going stale (' || a.bd || ' business days, limit ' || json_extract(lim.d, '$.' || a.type) || ' for ' || a.type || '): ' || a.topic AS summary,
       'In DSB Admin → Flow: Publish now (next blog round) or Discard' AS suggested_action
FROM aged a, lim
WHERE json_extract(lim.d, '$.' || a.type) IS NOT NULL AND a.bd >= json_extract(lim.d, '$.' || a.type);

INSERT INTO health_checks(name, view_name, description) VALUES
  ('going_stale', 'v_hc_going_stale', 'Approved post past the plan''s business-day limit without a blog article');
