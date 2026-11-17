-- DSB · 0004 — a job error is an event, not a standing condition.
-- Before: the job run keeps status 'error' for good, so every sweep within 7 days reopened job_failed:<id>
-- right after Marcelo resolved it (a new issue number each time the panel opened).
-- Now: once a person resolves or ignores job_failed:<id>, that job run is done; the sweep no longer reopens it.
-- Auto-resolutions (resolved_by = 'auto') do not count; other checks keep reopening while their condition holds.

DROP VIEW IF EXISTS v_hc_job_failed;
CREATE VIEW v_hc_job_failed AS
SELECT 'job_failed:' || j.id AS fingerprint, 'job_failed' AS kind, 'error' AS severity,
       'job' AS stage, NULL AS post_id, NULL AS publication_id,
       'Job ' || j.job || ' finished with an error: ' || IFNULL(j.notes, 'no detail') AS summary,
       'Read the job run notes and fix the cause' AS suggested_action
FROM job_runs j
WHERE j.status = 'error' AND julianday('now') - julianday(j.started_at) <= 7
  AND NOT EXISTS (SELECT 1 FROM issues i
                  WHERE i.fingerprint = 'job_failed:' || j.id
                    AND i.status IN ('resolved','ignored') AND i.resolved_by IS NOT 'auto');
