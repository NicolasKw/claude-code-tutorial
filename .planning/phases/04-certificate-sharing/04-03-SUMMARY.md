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

## Human Verification (Task 2)

**Status: Approved by human on 2026-04-03**

The human verified the complete certificate generation and sharing flow:

1. Registration stores userId in localStorage — both `sessionId` and `userId` keys confirmed in DevTools Application tab
2. `/api/certificate/[userId]` generates a branded PNG: dark background, ZalesMachine wordmark in purple, user name in white, "Claude Code Mastery" in green, level count in blue, completion date at bottom
3. `/certificate/[userId]` shows "Lo lograste!" heading, certificate preview, working download button, LinkedIn share dialog opens, copy button shows "Copiado" confirmation
4. OG meta tags (`og:image`, `og:title`, `og:description`) confirmed present in page source
5. Certificate page loads without auth in incognito window

## Next Phase Readiness

- Certificate sharing flow complete end-to-end: registration → tutorial → all 7 levels → completedAt set → navigate to /certificate/[userId] → download/share/copy
- All automated tests green (111/111 passing)
- TypeScript compiles cleanly
- Phase 05 (email delivery) can begin — completedAt is available in JSONB for email trigger logic
- Phase 06 (LinkedIn auth) can proceed — userId is stored in localStorage and flows through the entire certificate chain

---
*Phase: 04-certificate-sharing*
*Completed: 2026-04-04*
