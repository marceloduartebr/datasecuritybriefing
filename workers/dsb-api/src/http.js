export class ApiError extends Error {
  /**
   * @param {number} status HTTP status
   * @param {string} code stable identifier the agent can branch on
   * @param {string} message short English text
   * @param {object} [extra] data for the caller (e.g. the colliding post)
   */
  constructor(status, code, message, extra = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function readBody(request) {
  let text = '';
  try {
    text = await request.text();
  } catch {
    throw new ApiError(400, 'invalid_body', 'Could not read the request body');
  }
  if (!text) return {};
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    throw new ApiError(400, 'invalid_json', 'Body is not valid JSON');
  }
  if (!j || typeof j !== 'object' || Array.isArray(j)) throw new ApiError(400, 'invalid_json', 'Body must be a JSON object');
  return j;
}

export const nowIso = () => new Date().toISOString();

/** undefined → null (D1 rejects undefined in bind). */
export const nz = (v) => (v === undefined ? null : v);

/** Maps an SQLite constraint error to a readable ApiError. */
export function constraintError(e) {
  const msg = String((e && e.message) || e);
  if (/UNIQUE constraint failed: posts\.slug/.test(msg)) return new ApiError(409, 'slug_taken', 'Slug already used by another post');
  if (/UNIQUE constraint failed: posts\.notion_id/.test(msg)) return new ApiError(409, 'notion_id_taken', 'Notion page already imported');
  if (/UNIQUE constraint failed: post_keys\.key|post_keys\.key/.test(msg)) return new ApiError(409, 'subject_already_covered', 'Subject key already belongs to another post');
  if (/UNIQUE constraint failed: publications/.test(msg)) return new ApiError(409, 'publication_already_claimed', 'A publication already exists for this channel and language');
  if (/CHECK constraint failed/.test(msg)) return new ApiError(422, 'invalid_value', 'Value violates a database rule', { detail: msg.slice(0, 300) });
  if (/FOREIGN KEY constraint failed/.test(msg)) return new ApiError(422, 'invalid_reference', 'Reference to a missing row');
  if (/NOT NULL constraint failed/.test(msg)) return new ApiError(422, 'field_required', 'Required field missing', { detail: msg.slice(0, 300) });
  return null;
}
