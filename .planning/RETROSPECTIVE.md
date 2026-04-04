# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-04
**Phases:** 4 | **Plans:** 13 | **Timeline:** 2 days (2026-04-02 → 2026-04-03)

### What Was Built

- Full registration flow — Next.js 16.2.2 + Drizzle/Supabase + Zod + SessionGuard + 24 tests
- 7-level tutorial shell — useProgress hook, LevelPage, StepCard, AchievementOverlay, TutorialHeader — 81 tests
- Complete Spanish tutorial content — 7 levels, 25 steps, Chatbot → Sub-agentes, ~56 min, every step with terminal commands + collapsible error callouts
- Certificate + sharing — PNG via `next/og` ImageResponse, public OG-tagged page, download, LinkedIn share, clipboard copy — 111 tests

### What Worked

- **TDD Wave 0 pattern** — writing `it.todo()` stubs before implementation caught API design issues early and kept test suite always-green during development
- **Phase separation by concern** — splitting foundation (Phase 1), engine (Phase 2), content (Phase 3), and certificate (Phase 4) made each phase independently verifiable and allowed clean handoffs
- **Server actions + localStorage dual-write** — optimistic UX with DB durability; the pattern was clean and testable
- **`next/og` ImageResponse** — zero-dependency PNG generation; the Satori CSS subset constraint (flexbox only, literal hex values) was well-documented in plan

### What Was Inefficient

- **INT-01 cross-phase bug** — Phase 01 redirected to `/tutorial/1` but Phase 02 renumbered levels to 0-based. This wasn't caught until milestone audit because each phase verified its own piece in isolation. Integration checker caught it immediately.
- **REQUIREMENTS.md stale checkboxes** — CONT-01, 03, 04, 05 were never updated to `[x]` after Phase 03 completed; the Phase 03 plan writer didn't update the traceability table
- **Nyquist VALIDATION.md frontmatter** — All 4 phases have Wave 0 tests passing but `nyquist_compliant: false` remains in frontmatter; the gsd-verifier doesn't update VALIDATION.md

### Patterns Established

- Wave 0 TDD: `it.todo()` stubs (not `it.skip()`) define behavioral contract without failing suite
- Server Action barrel pattern: `src/app/actions/` as directory with `index.ts` re-export for co-located `__tests__/`
- `@vitest-environment node` comment on server action test files to avoid jsdom/`use server` conflicts
- `useProgress` dual-write: localStorage for instant UX, `saveProgress` for durability — call pattern is fire-and-forget (`.catch(() => {})`)
- Certificate navigation guard: `if (level >= TOTAL_LEVELS - 1)` → route to `/certificate/${userId}` on final level completion
- Satori constraint for `next/og`: use flexbox only, literal hex values (no CSS variables, no grid)

### Key Lessons

1. **Cross-phase integration gaps require explicit integration testing.** Individual phase verifications don't catch bugs that span phase boundaries. The milestone audit's integration checker is the right gate for this — run it before claiming a milestone complete.
2. **Level numbering conventions must be defined in Phase 1 and referenced in all subsequent phases.** The 0-based vs 1-based mismatch was a coordination gap; should be a named constant in types from day one.
3. **REQUIREMENTS.md checkboxes drift when plans don't explicitly reference them.** Phase 3 plans authored content but didn't update traceability. Plans should include a "requirements-completed" checklist that maps back to REQUIREMENTS.md.

### Cost Observations

- Model: claude-sonnet-4-6 throughout
- Sessions: ~4 (foundation, tutorial engine, content, certificate)
- Notable: 2-day full-product build from zero to 111 passing tests; TDD kept rework minimal

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 4 | 13 | First milestone — established TDD Wave 0 pattern, dual-write progress hook, server action barrel |

### Cumulative Quality

| Milestone | Tests | Stack | LOC |
|-----------|-------|-------|-----|
| v1.0 | 111 | Next.js 16 + Drizzle + Supabase + next/og | 3,592 TypeScript |

### Top Lessons (Verified Across Milestones)

1. Integration checker at milestone audit catches cross-phase wiring bugs that individual verifications miss
2. TDD Wave 0 (`it.todo()` stubs) defines the behavioral contract before implementation and keeps the suite always-green
