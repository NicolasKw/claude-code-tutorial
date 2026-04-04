---
phase: 04-certificate-sharing
plan: 03
subsystem: ui
tags: [next.js, drizzle-orm, vitest, tutorial, certificate, progress]

# Dependency graph
requires:
  - phase: 04-certificate-sharing/04-01
    provides: "getUserForCertificate helper, TutorialProgress.completedAt type, getUserId session helper"
provides:
  - "saveProgress sets completedAt once when all 7 levels are complete"
  - "LevelPage navigates to /certificate/[userId] on final level completion"
  - "certificate.test.ts has real assertions for getUserForCertificate (2 test cases)"
affects:
  - tutorial-flow
  - certificate-sharing

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "completedAt guard: set once via !data.completedAt, never overwritten on subsequent saves"
    - "Conditional navigation: check level >= TOTAL_LEVELS - 1 before deciding route target"
    - "Drizzle chain mocking: mock each link in select().from().leftJoin().where().limit() inline"

key-files:
  created: []
  modified:
    - src/app/actions/progress.ts
    - src/components/tutorial/LevelPage.tsx
    - src/lib/__tests__/certificate.test.ts

key-decisions:
  - "Mock vi.mock factory must not reference outer variables (hoisting). Use inline vi.fn() chains per test case via vi.mocked(db.select).mockReturnValue()"

patterns-established:
  - "Drizzle ORM chain mocking: override db.select per-test with full inline chain to avoid hoisting issues"

requirements-completed:
  - CERT-01
  - CERT-03

# Metrics
duration: 8min
completed: 2026-04-04
---

# Phase 04 Plan 03: Certificate Sharing — Completion Flow Summary

**saveProgress sets completedAt once on all-7-levels complete; LevelPage routes to /certificate/[userId] on final level; getUserForCertificate query tested with real db chain mocks**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-04T01:19:00Z
- **Completed:** 2026-04-04T01:27:00Z
- **Tasks:** 1 (Task 2 is a human-verify checkpoint)
- **Files modified:** 3

## Accomplishments

- `saveProgress` now stamps `completedAt` (ISO string) exactly once when all 7 levels complete — subsequent saves skip the guard because `!data.completedAt` is false
- `LevelPage` AchievementOverlay navigates to `/certificate/[userId]` (falling back to `/` if userId missing) on the final level instead of the nonexistent `/tutorial/7`
- `certificate.test.ts` converted from 2 `it.todo()` stubs to 2 fully asserted test cases verifying return shape and null path of `getUserForCertificate`

## Task Commits

Each task was committed atomically:

1. **Task 1: completedAt in saveProgress and certificate navigation in LevelPage** - `22b6340` (feat)

## Files Created/Modified

- `src/app/actions/progress.ts` - Added TOTAL_LEVELS import and completedAt guard before upsert
- `src/components/tutorial/LevelPage.tsx` - Added getUserId/TOTAL_LEVELS imports, conditional navigate in AchievementOverlay
- `src/lib/__tests__/certificate.test.ts` - Replaced 2 todo stubs with real assertions using inline Drizzle chain mocks

## Decisions Made

- Vitest vi.mock factories cannot reference outer `const` variables (they are hoisted before variable initialization). Solved by using `vi.mocked(db.select).mockReturnValue(...)` inline per test after the module is imported, rather than wiring up shared chain variables in the factory.

## Deviations from Plan

None — plan executed exactly as written. The test restructuring (using per-test `mockReturnValue` instead of shared outer variables) was a necessary implementation detail to satisfy the hoisting constraint, not a deviation from intent.

## Issues Encountered

- First certificate test attempt used top-level `const mockLimit = vi.fn()` referenced inside `vi.mock()` factory, causing a "Cannot access before initialization" hoisting error. Fixed by using inline `vi.fn()` per test case via `vi.mocked(db.select).mockReturnValue(...)`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Task 2 (human-verify) is pending: human must visually confirm the full certificate flow (registration stores userId, /api/certificate/[userId] generates PNG, /certificate/[userId] page works, buttons functional, OG tags present, page is public)
- All automated tests green (111/111 passing)
- TypeScript compiles cleanly (pre-existing errors in progress.test.ts mock typing are unrelated to this plan)

---
*Phase: 04-certificate-sharing*
*Completed: 2026-04-04*
