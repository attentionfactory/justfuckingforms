// Helpers to turn a flat inbox feed into the day-grouped + color-chipped shape
// the InboxPage UI consumes. Pure functions — easy to unit-test if we ever do.

import type { InboxRow } from "./api-types";

const DAY_PALETTE = ["#0099ff", "#16a34a", "#a855f7", "#f59e0b", "#ec4899", "#0ea5e9"];

export type InboxGroup = {
  day: string;
  items: Array<
    InboxRow & {
      time: string;
      who: string;
      message: string;
    }
  >;
};

export function groupInbox(rows: InboxRow[]): InboxGroup[] {
  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(today.getTime() - 86400000));

  const groups = new Map<string, InboxGroup>();

  for (const row of rows) {
    const created = new Date(row.createdAt);
    const dayStart = startOfDay(created);
    const label =
      dayStart.getTime() === today.getTime()
        ? "today"
        : dayStart.getTime() === yesterday.getTime()
          ? "yesterday"
          : created
              .toLocaleDateString("en-US", { month: "short", day: "numeric" })
              .toLowerCase();

    const existing = groups.get(label) ?? { day: label, items: [] };
    existing.items.push({
      ...row,
      time: created.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      who: pickEmail(row.data) ?? "(unknown)",
      message: pickMessage(row.data),
    });
    groups.set(label, existing);
  }

  return [...groups.values()];
}

export function formColors(rows: InboxRow[]): Record<string, string> {
  const seen = new Map<string, string>();
  let i = 0;
  for (const row of rows) {
    if (!seen.has(row.formName)) {
      seen.set(row.formName, DAY_PALETTE[i % DAY_PALETTE.length]);
      i++;
    }
  }
  return Object.fromEntries(seen);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function pickEmail(data: Record<string, unknown>): string | null {
  for (const k of ["email", "from", "reply_to", "contact"]) {
    const v = data[k];
    if (typeof v === "string" && v.includes("@")) return v;
  }
  return null;
}

function pickMessage(data: Record<string, unknown>): string {
  for (const k of ["message", "body", "comment", "note", "text"]) {
    const v = data[k];
    if (typeof v === "string") return v;
  }
  // Fall back to any string field that's not the email/honeypot.
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || k === "email" || k === "website") continue;
    if (typeof v === "string") return v;
  }
  return "";
}
