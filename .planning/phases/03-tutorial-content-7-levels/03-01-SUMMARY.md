---
phase: 03-tutorial-content-7-levels
plan: 01
subsystem: ui, testing
tags: [typescript, react, tailwind, vitest, testing-library, html-details]

# Dependency graph
requires:
  - phase: 02-tutorial-shell-progress-engine
    provides: Tutorial shell components (CodeBlock, StepCard, TutorialHeader) and progress types (TutorialProgress)
provides:
  - ErrorCalloutContent, StepContent, LevelContent TypeScript interfaces in src/lib/types/tutorial.ts
  - ErrorCallout React component (collapsible HTML details/summary, amber styling)
  - Wave 0 content validation test stubs covering CONT-01 through CONT-05
affects:
  - 03-02 (levels 0-3 content authoring)
  - 03-03 (levels 4-6 content authoring)
  - 03-04 (wiring LEVEL_CONTENT data to components)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Wave 0 TDD: write it.todo() stubs before content authoring — test contract precedes implementation"
    - "Native HTML details/summary for collapsible UI — no React state, no 'use client' directive"
    - "Content types separate from progress types — ErrorCalloutContent/StepContent/LevelContent extend tutorial.ts"

key-files:
  created:
    - src/components/tutorial/ErrorCallout.tsx
    - src/components/__tests__/ErrorCallout.test.tsx
    - src/lib/__tests__/content.test.ts
  modified:
    - src/lib/types/tutorial.ts

key-decisions:
  - "ErrorCallout uses native HTML details/summary with no 'use client' — browser-native collapsible needs no React state"
  - "Wave 0 stubs use it.todo() not it.skip() — consistent with Phase 02 decision, pending tests define contract without failing suite"
  - "Content types appended to existing tutorial.ts — single source of truth for all tutorial domain types"

patterns-established:
  - "TDD RED-GREEN: write failing test, commit, implement, confirm green, commit"
  - "Native HTML over client components when no React state is needed"

requirements-completed: [CONT-02]

# Metrics
duration: 2min
completed: 2026-04-03
---

# Phase 03 Plan 01: Content Types, ErrorCallout, and Wave 0 Stubs Summary

**ErrorCalloutContent/StepContent/LevelContent types, collapsible ErrorCallout component with amber HTML details/summary, and 11 it.todo() Wave 0 stubs covering CONT-01 through CONT-05**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-03T22:39:33Z
- **Completed:** 2026-04-03T22:40:38Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extended tutorial.ts with three new interfaces: ErrorCalloutContent, StepContent, LevelContent
- Created ErrorCallout component using native HTML details/summary element (no React state, no 'use client')
- Created 11 it.todo() stubs covering all CONT requirements (CONT-01 through CONT-05) — Wave 0 contract established

## Task Commits

Each task was committed atomically:

1. **Task 1: RED — failing ErrorCallout tests** - `f434e97` (test)
2. **Task 1: GREEN — content types + ErrorCallout component** - `2fa30c8` (feat)
3. **Task 2: Wave 0 content validation test stubs** - `fd1709f` (test)

_Note: TDD tasks have separate RED and GREEN commits per TDD protocol_

## Files Created/Modified
- `src/lib/types/tutorial.ts` - Added ErrorCalloutContent, StepContent, LevelContent interfaces (existing TutorialProgress/PROGRESS_KEY/TOTAL_LEVELS/DEFAULT_PROGRESS preserved)
- `src/components/tutorial/ErrorCallout.tsx` - Collapsible error callout using HTML details/summary, amber-50 background
- `src/components/__tests__/ErrorCallout.test.tsx` - 4 unit tests covering renders, summary text, solution text, amber class
- `src/lib/__tests__/content.test.ts` - 11 it.todo() stubs: 9 for LEVEL_CONTENT shape, 2 for getLevelContent

## Decisions Made
- ErrorCallout uses native HTML `details`/`summary` with no `'use client'` directive — browser collapsible needs no React state, consistent with Next.js server component defaults
- Wave 0 stubs use `it.todo()` not `it.skip()` — consistent with Phase 02 decision documented in STATE.md
- Content types appended to existing `tutorial.ts` to keep all tutorial domain types in one file

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Content type contracts established: Plans 02 and 03 can now author LEVEL_CONTENT data against these interfaces
- Wave 0 test stubs ready: Plan 04 (wiring) will convert it.todo() into real assertions
- Full test suite passes (85 tests + 11 todos, no regressions)

---
*Phase: 03-tutorial-content-7-levels*
*Completed: 2026-04-03*
