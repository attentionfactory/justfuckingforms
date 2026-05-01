// Mock fixtures used by Phase 8 UI-first stubs. Replaced by real DB queries in Phase 6.
// Mirrors the design source data in /tmp/jff_design/iloveforms/project/{dashboard-list,inbox,schema}.jsx

export type MockForm = {
  id: string;
  name: string;
  email: string;
  subs: number;
  last: string;
  active: boolean;
};

export const FORMS: MockForm[] = [
  { id: "a3f9k2x", name: "transcriptx contact", email: "mercy@transcriptx.xyz", subs: 142, last: "2 min ago", active: true },
  { id: "b8m1q7p", name: "attentionfactory waitlist", email: "hello@attentionfactory.io", subs: 891, last: "14 min ago", active: true },
  { id: "c2n5w9r", name: "mercythaddeus newsletter", email: "me@mercythaddeus.xyz", subs: 12, last: "3 days ago", active: true },
  { id: "d7t4j8s", name: "old portfolio", email: "me@mercythaddeus.xyz", subs: 0, last: "never", active: false },
];

export type MockSubmission = {
  id: number;
  when: string;
  who: string;
  message: string;
  spam: boolean;
};

export const SUBS: MockSubmission[] = [
  { id: 1, when: "2 min ago", who: "jen@stripe.com", message: "hey, would love to chat about a partnership. ping me when you have a minute.", spam: false },
  { id: 2, when: "14 min ago", who: "tunde@paystack.com", message: "great work on the launch. drinks next week?", spam: false },
  { id: 3, when: "47 min ago", who: "crypto-king@gmail.com", message: "CONGRATULATIONS YOU HAVE WON $$$$$ click here", spam: true },
  { id: 4, when: "2h ago", who: "sarah@vercel.com", message: "love what you're doing. can we feature you on the blog?", spam: false },
  { id: 5, when: "4h ago", who: "devon@indiehackers.com", message: "submitted a tip about your project for the newsletter.", spam: false },
  { id: 6, when: "8h ago", who: "noreply@spammer.ru", message: "BUY VIAGRA NOW", spam: true },
  { id: 7, when: "1d ago", who: "rohan@ycombinator.com", message: "are you taking on contract work? we have an interesting project.", spam: false },
  { id: 8, when: "1d ago", who: "bilkis@meta.com", message: "recruiter here — saw your tweet. mind a quick call?", spam: false },
  { id: 9, when: "2d ago", who: "someone@nowhere.com", message: "broken contact form on /about. just fyi.", spam: false },
  { id: 10, when: "3d ago", who: "totally-real@bot.net", message: "click http://shady.link to claim", spam: true },
];

export type InboxItem = {
  time: string;
  form: string;
  who: string;
  message: string;
  spam: boolean;
  unread: boolean;
};

export const INBOX: { day: string; items: InboxItem[] }[] = [
  {
    day: "today",
    items: [
      { time: "11:24", form: "transcriptx contact", who: "jen@stripe.com", message: "hey, would love to chat about a partnership. ping me when you have a minute.", spam: false, unread: true },
      { time: "11:12", form: "attentionfactory waitlist", who: "tunde@paystack.com", message: "great work on the launch. drinks next week?", spam: false, unread: true },
      { time: "10:39", form: "transcriptx contact", who: "crypto-king@gmail.com", message: "CONGRATULATIONS YOU HAVE WON $$$$$ click here", spam: true, unread: false },
      { time: "09:18", form: "attentionfactory waitlist", who: "sarah@vercel.com", message: "love what you're doing. can we feature you on the blog?", spam: false, unread: false },
    ],
  },
  {
    day: "yesterday",
    items: [
      { time: "22:04", form: "mercythaddeus newsletter", who: "devon@indiehackers.com", message: "submitted a tip about your project for the newsletter.", spam: false, unread: false },
      { time: "17:51", form: "attentionfactory waitlist", who: "noreply@spammer.ru", message: "BUY VIAGRA NOW", spam: true, unread: false },
      { time: "14:22", form: "transcriptx contact", who: "rohan@ycombinator.com", message: "are you taking on contract work? we have an interesting project.", spam: false, unread: false },
      { time: "09:47", form: "transcriptx contact", who: "bilkis@meta.com", message: "recruiter here — saw your tweet. mind a quick call?", spam: false, unread: false },
    ],
  },
  {
    day: "apr 28",
    items: [
      { time: "15:03", form: "mercythaddeus newsletter", who: "someone@nowhere.com", message: "broken contact form on /about. just fyi.", spam: false, unread: false },
      { time: "08:11", form: "attentionfactory waitlist", who: "totally-real@bot.net", message: "click http://shady.link to claim", spam: true, unread: false },
    ],
  },
];

export const FORM_COLORS: Record<string, string> = {
  "transcriptx contact": "#0099ff",
  "attentionfactory waitlist": "#16a34a",
  "mercythaddeus newsletter": "#a855f7",
};

export type InferredField = {
  key: string;
  type: "string" | "text" | "number" | "boolean";
  seen: number;
  pct: number;
  pinned: boolean;
  visible: boolean;
  isNew: boolean;
  sample: string;
};

export const INFERRED_FIELDS: InferredField[] = [
  { key: "email", type: "string", seen: 142, pct: 100, pinned: true, visible: true, isNew: false, sample: "jen@stripe.com" },
  { key: "name", type: "string", seen: 138, pct: 97, pinned: true, visible: true, isNew: false, sample: "Sarah Drasner" },
  { key: "message", type: "text", seen: 142, pct: 100, pinned: false, visible: true, isNew: false, sample: "love what you're..." },
  { key: "company", type: "string", seen: 89, pct: 63, pinned: false, visible: true, isNew: false, sample: "Vercel" },
  { key: "budget", type: "string", seen: 12, pct: 8, pinned: false, visible: false, isNew: true, sample: "$5k–10k" },
  { key: "source", type: "string", seen: 4, pct: 3, pinned: false, visible: false, isNew: true, sample: "twitter" },
  { key: "_subject", type: "string", seen: 142, pct: 100, pinned: false, visible: false, isNew: false, sample: "Contact form" },
];

export type AllowedDomain = {
  value: string;
  status: "verified" | "dev" | "pending";
  last: string;
};

export const ALLOWED_DOMAINS: AllowedDomain[] = [
  { value: "transcriptx.xyz", status: "verified", last: "2 min ago" },
  { value: "*.transcriptx.xyz", status: "verified", last: "2 min ago" },
  { value: "localhost:3000", status: "dev", last: "1 hour ago" },
];

export const CURRENT_USER = {
  initial: "M",
  email: "mercy@transcriptx.xyz",
  workspace: "workspace",
  plan: "free plan",
};
