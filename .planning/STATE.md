# State: JustFuckingForms

**Initialized:** 2026-05-01
**Milestone:** v1.0 launch (active)
**Current phase:** Phase 1 — Monorepo & design tokens (pending start)

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-01)

**Core value:** You POST → we email → we store the row.
**Current focus:** Phase 1 — bootstrap monorepo, scaffold apps, install design tokens + shadcn/ui.

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | Monorepo & design tokens | Pending |
| 2 | Database package | Pending |
| 3 | Auth package + auth pages | Pending |
| 4 | API skeleton | Pending |
| 5 | Submission handler | Pending |
| 6 | Dashboard CRUD endpoints | Pending |
| 7 | Marketing & auth pages (UI) | Pending |
| 8 | Dashboard UI | Pending |
| 9 | Billing, polish, deploy | Pending |

## Design Bundle

External design files: `/tmp/jff_design/iloveforms/project/`

Source-of-truth visuals locked in:
- `JFF Designs.html` — canvas wrapper enumerating all 22 screens
- `styles.css` — design tokens (--bg, --fg, --muted, --line, --link, etc.)
- `landings.jsx`, `auth.jsx`, `dashboard-list.jsx`, `dashboard-detail.jsx`, `extras.jsx`, `inbox.jsx`, `schema.jsx`, `allowed-domains.jsx`, `musthaves.jsx`, `referrals.jsx`, `shared.jsx`, `icons.jsx`

When implementing UI in Phases 7/8/9, use these as the literal target — match copy, color values, layout, and spacing exactly. Adapt structure to React Server Components + shadcn primitives, but visuals match.

## Open Questions

- Onboarding steps 1 and 3 — only step 2 fully designed. Step 1 = workspace name; Step 3 = "here's your endpoint, copy it." (DASH-08 requires implementing them per the design footnote.)
- Spec mentioned email/password auth in addition to magic link; design locked to magic-link only. Decision recorded in PROJECT.md → magic-link only for v1.
- Polar webhook signing — exact event names depend on Polar SDK version; pin during Phase 9.

## Notes

- GitHub remote not yet configured. Once added, retrofit issues for completed phases via `gh issue create --milestone "Phase 1" ...`.
- No CI yet. Add GitHub Actions for `pnpm turbo lint && pnpm turbo type-check && pnpm turbo build` once Phase 1 lands.

---
*Last updated: 2026-05-01 after initialization*
