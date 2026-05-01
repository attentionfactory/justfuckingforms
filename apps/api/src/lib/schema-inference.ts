// Walks the last N submissions for a form and produces an inferred schema:
// every distinct top-level key, ranked by frequency, with sample value + type.
// Mirrors the shape consumed by the dashboard's <SchemaPanel /> + ColumnPicker.

import type { InferredField } from '@jff/types';

export type SubmissionRow = {
  data: Record<string, unknown>;
  createdAt: Date;
};

const NEW_THRESHOLD_HOURS = 24 * 7; // fields first seen in the last week
const VISIBILITY_THRESHOLD_PCT = 10; // <10% present → hide by default

export function inferSchema(rows: SubmissionRow[]): InferredField[] {
  if (rows.length === 0) return [];

  const counts = new Map<string, number>();
  const samples = new Map<string, string>();
  const types = new Map<string, InferredField['type']>();
  const firstSeen = new Map<string, Date>();

  for (const row of rows) {
    if (!row.data || typeof row.data !== 'object') continue;
    for (const [k, v] of Object.entries(row.data)) {
      counts.set(k, (counts.get(k) ?? 0) + 1);
      if (!samples.has(k) && v != null && v !== '') {
        samples.set(k, stringify(v));
      }
      if (!types.has(k)) {
        types.set(k, classify(v));
      }
      if (!firstSeen.has(k) || row.createdAt < firstSeen.get(k)!) {
        firstSeen.set(k, row.createdAt);
      }
    }
  }

  const total = rows.length;
  const cutoff = Date.now() - NEW_THRESHOLD_HOURS * 60 * 60 * 1000;

  return [...counts.entries()]
    .map(([key, seen]) => {
      const pct = Math.round((seen / total) * 100);
      const isNew = (firstSeen.get(key)?.getTime() ?? 0) >= cutoff && pct < 50;
      return {
        key,
        type: types.get(key) ?? 'string',
        seen,
        pct,
        isNew,
        sample: samples.get(key) ?? '',
      } satisfies InferredField;
    })
    .sort((a, b) => b.pct - a.pct);
}

export function defaultVisibleFields(fields: InferredField[]): InferredField[] {
  return fields.filter((f) => f.pct >= VISIBILITY_THRESHOLD_PCT && !f.key.startsWith('_'));
}

function classify(v: unknown): InferredField['type'] {
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'object' && v !== null) return 'json';
  const s = String(v ?? '');
  return s.length > 80 ? 'text' : 'string';
}

function stringify(v: unknown): string {
  if (Array.isArray(v)) return v.map(String).join(', ');
  if (typeof v === 'object' && v !== null) return JSON.stringify(v);
  return String(v).slice(0, 200);
}
