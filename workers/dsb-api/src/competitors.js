/**
 * BigID competitors (single list, migration 0003). Agents read it before curating or writing.
 * GET /competitors              → active rows with aliases as a list, plus the editorial rule
 * GET /competitors?text=…       → also `matches`: competitors whose name or alias appears in the text
 */
export const RULE = {
  blocked:
    'Funding, M&A where the competitor buys or is bought, product launches or GA, awards, analyst rankings, ' +
    'partnerships, integrations or marketplace listings, customer contracts, executive hires, and research or ' +
    'reports published by the competitor itself (even with new data).',
  allowed: 'Incidents, breaches, flaws, CVE/KEV, enforcement or sanctions that affect the competitor or its customers, in a neutral tone.',
  platform_module:
    'Diversified platforms: only content promoting the module that competes with BigID is blocked; their security ' +
    'advisories and threat intelligence about real attacks may be used as sources.',
  doubt: 'When in doubt whether a company competes, treat it as a competitor.'
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Whole-name match; all-caps names (MIND) are case-sensitive so the plain word does not match. */
const nameRegex = (n) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escape(n)}($|[^\\p{L}\\p{N}])`, n === n.toUpperCase() ? 'u' : 'iu');

export async function listCompetitors(db, params) {
  const r = await db.prepare('SELECT name, kind, aliases, notes FROM competitors WHERE active = 1 ORDER BY kind, name').all();
  const items = (r.results || []).map((c) => ({
    ...c,
    aliases: c.aliases ? c.aliases.split(',').map((a) => a.trim()).filter(Boolean) : []
  }));
  const out = { rule: RULE, competitors: items };
  const text = params.get('text');
  if (text) {
    const t = text.slice(0, 20000);
    out.matches = items
      .filter((c) => [c.name, ...c.aliases].some((n) => nameRegex(n).test(t)))
      .map((c) => ({ name: c.name, kind: c.kind }));
  }
  return out;
}
