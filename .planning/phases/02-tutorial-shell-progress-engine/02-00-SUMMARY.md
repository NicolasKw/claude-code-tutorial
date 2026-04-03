---
phase: 02-tutorial-shell-progress-engine
plan: "00"
subsystem: testing
tags: [vitest, tdd, test-stubs, progress, useProgress, saveProgress, TutorialHeader, LevelPage, StepCard, AchievementOverlay, CodeBlock]

# Dependency graph
requires: []
provides:
  - "8 it.todo test stub files covering all TUTO-01 through TUTO-06 requirements"
  - "54 pending Vitest tests defining exact behavioral expectations for Wave 1 and Wave 2 implementation"
  - "hooks/__tests__/ directory established"
affects: ["02-01", "02-02", "02-03"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "it.todo() pattern for Vitest RED stubs (pending, never fail)"
    - "Separate __tests__ subdirectory per src/ subsystem (lib, hooks, components, app/actions)"

key-files:
  created:
    - src/lib/__tests__/progress.test.ts
    - src/hooks/__tests__/useProgress.test.ts
    - src/app/actions/__tests__/progress.test.ts
    - src/components/__tests__/TutorialHeader.test.tsx
    - src/components/__tests__/LevelPage.test.tsx
    - src/components/__tests__/StepCard.test.tsx
    - src/components/__tests__/AchievementOverlay.test.tsx
    - src/components/__tests__/CodeBlock.test.tsx
  modified: []

key-decisions:
  - "Used it.todo() not it.skip() — it.todo shows tests as pending (not skipped/failed), correct Nyquist contract"
  - "Component stubs use .tsx extension to support future JSX when assertions are added in Wave 2"

patterns-established:
  - "Pattern 1: Wave 0 TDD — all test stubs written before any implementation begins"
  - "Pattern 2: it.todo() for pending behavioral contracts — Wave 2 implementors replace with real assertions"

requirements-completed: [TUTO-01, TUTO-02, TUTO-03, TUTO-04, TUTO-05, TUTO-06]

# Metrics
duration: 1min
completed: 2026-04-03
---

# Phase 02 Plan 00: Wave 0 Test Stubs Summary

**54 it.todo Vitest stubs across 8 files defining the full behavioral contract for tutorial shell, progress engine, and achievement overlay before any implementation**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-03T21:36:31Z
- **Completed:** 2026-04-03T21:37:33Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Created 3 pure logic/hook/server-action test stubs (25 it.todo tests) covering isLevelLocked, isStepCompleted, completeStep, completeLevel, useProgress, and saveProgress
- Created 5 component test stubs (29 it.todo tests) covering TutorialHeader, LevelPage, StepCard, AchievementOverlay, and CodeBlock
- npm test passes all 5 existing suites (24 tests) plus registers all 8 new stubs with 54 todos — zero failures

## Task Commits

Each task was committed atomically:

1. **Task 1: Pure logic and hook test stubs (3 files)** - `91579fb` (test)
2. **Task 2: Component test stubs (5 files)** - `dd4f509` (test)

**Plan metadata:** _(final doc commit — see below)_

## Files Created/Modified

- `src/lib/__tests__/progress.test.ts` — 14 it.todo stubs for isLevelLocked, isStepCompleted, completeStep, completeLevel
- `src/hooks/__tests__/useProgress.test.ts` — 7 it.todo stubs for useProgress hook (localStorage, server action call)
- `src/app/actions/__tests__/progress.test.ts` — 4 it.todo stubs for saveProgress server action
- `src/components/__tests__/TutorialHeader.test.tsx` — 5 it.todo stubs for sticky header and progress bar aria attributes
- `src/components/__tests__/LevelPage.test.tsx` — 5 it.todo stubs for level lock gate ("bloqueado" string, lock icon, back button)
- `src/components/__tests__/StepCard.test.tsx` — 6 it.todo stubs for "Listo, ya lo hice" button and completion state
- `src/components/__tests__/AchievementOverlay.test.tsx` — 7 it.todo stubs for level completion modal (dialog, CTA, "completado" heading)
- `src/components/__tests__/CodeBlock.test.tsx` — 6 it.todo stubs for clipboard copy and "Copiar/Copiado" aria-label toggle

## Decisions Made

- Used `it.todo()` instead of `it.skip()` — todo shows as pending in Vitest output (not a skip or failure), matching the Nyquist contract intent
- Component stub files use `.tsx` extension to support future JSX assertions without renaming

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

All 54 it.todo items are intentional stubs. They will be replaced with real assertions in Wave 2 plans (02-02 and 02-03). No stub prevents this plan's goal (establishing the test contract) from being achieved.

## Next Phase Readiness

- All 8 test stub files are in place and recognized by Vitest
- Wave 1 implementors (02-01) can begin writing progress.ts, useProgress.ts, and server action implementations knowing the exact behavioral expectations
- Wave 2 implementors (02-02, 02-03) will replace it.todo with real assertions as they build components
- Existing Phase 1 tests (session, validations, RegistrationForm, SessionGuard, register) remain green

---
*Phase: 02-tutorial-shell-progress-engine*
*Completed: 2026-04-03*
