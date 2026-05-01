// Submission body parser. Supports x-www-form-urlencoded, multipart/form-data,
// and application/json. Returns a flat string-or-arrays-of-strings object —
// jsonb will store whatever shape comes out.
//
// Design intent: forms in the wild send urlencoded; modern fetch() submissions
// send JSON. We accept both and normalize.

export type SubmissionData = Record<string, unknown>;

export async function parseSubmissionBody(req: Request): Promise<SubmissionData> {
  const ct = req.headers.get('content-type') ?? '';

  if (ct.includes('application/json')) {
    try {
      const json = await req.json();
      return typeof json === 'object' && json !== null ? (json as SubmissionData) : { _raw: json };
    } catch {
      return {};
    }
  }

  // urlencoded or multipart — both arrive as FormData via .formData()
  if (
    ct.includes('application/x-www-form-urlencoded') ||
    ct.includes('multipart/form-data')
  ) {
    const fd = await req.formData();
    const out: SubmissionData = {};
    for (const [key, value] of fd.entries()) {
      // Skip File entries — file uploads are explicitly out of v1.
      if (typeof value !== 'string') continue;
      // If the key shows up multiple times, collect into an array.
      if (key in out) {
        const prev = out[key];
        out[key] = Array.isArray(prev) ? [...prev, value] : [prev, value];
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  // Unknown content-type — try urlencoded as a last resort.
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const out: SubmissionData = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  } catch {
    return {};
  }
}
