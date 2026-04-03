---
phase: 02-tutorial-shell-progress-engine
plan: 03
subsystem: ui
tags: [react, nextjs, vitest, testing-library, shadcn, tailwind, lucide-react]

requires:
  - phase: 02-tutorial-shell-progress-engine/02-01
    provides: TutorialProgress type, DEFAULT_PROGRESS, saveProgress server action, shadcn primitives (Button, Card), brand CSS tokens
  - phase: 02-tutorial-shell-progress-engine/02-02
    provides: useProgress hook interface, TutorialHeader, LockedLevel, CodeBlock (parallel — created compatible versions)

provides:
  - StepCard component with "Listo, ya lo hice" button and completion state
  - AchievementOverlay modal with level completion messaging and navigation
  - LevelPage orchestrator rendering TutorialHeader, StepCards, LockedLevel, AchievementOverlay
  - Page route /tutorial/[level] validating levels 0-6 with notFound()
  - useProgress hook (localStorage + saveProgress dual-write)
  - TutorialHeader (sticky header with badge and progress bar)
  - LockedLevel (lock gate with back button)
  - CodeBlock (dark code block with copy button)
  - All Wave 0 test stubs for 02-03 scope GREEN (22 tests)

affects:
  - 02-tutorial-shell-progress-engine/02-04
  - phase-03-tutorial-content
  - phase-04-certificate

tech-stack:
  added: [lucide-react, @base-ui/react (installed from package.json), @testing-library/react]
  patterns: [TDD red-green, client component with useProgress hook, server component page + client component LevelPage composition]

key-files:
  created:
    - src/components/tutorial/StepCard.tsx
    - src/components/tutorial/AchievementOverlay.tsx
    - src/components/tutorial/LevelPage.tsx
    - src/components/tutorial/TutorialHeader.tsx
    - src/components/tutorial/LockedLevel.tsx
    - src/components/tutorial/CodeBlock.tsx
    - src/hooks/useProgress.ts
  modified:
    - src/app/tutorial/[level]/page.tsx
    - src/components/__tests__/StepCard.test.tsx
    - src/components/__tests__/AchievementOverlay.test.tsx
    - src/components/__tests__/LevelPage.test.tsx
    - src/app/actions/__tests__/progress.test.ts

key-decisions:
  - "Created compatible versions of useProgress, TutorialHeader, LockedLevel, CodeBlock since 02-02 runs in parallel and was not yet available in this worktree"
  - "LevelPage renders TutorialHeader directly (not in layout) to share useProgress state and avoid dual hook instances"
  - "Level boundary is 0-6 (TOTAL_LEVELS=7); level 6 is the final level that shows 'Ver mi certificado'"
  - "Installed npm dependencies (lucide-react, @base-ui/react were in package.json but not installed in worktree)"

patterns-established:
  - "Server Component page + Client Component LevelPage: page.tsx is async server component that awaits params and validates; LevelPage is 'use client' with all hooks"
  - "Step-by-step reveal: only show steps up to and including first uncompleted step"
  - "Named exports (not default) for all tutorial components: export function StepCard, export function LevelPage, etc."

requirements-completed: [TUTO-01, TUTO-02, TUTO-03, TUTO-04]

duration: 7min
completed: 2026-04-03
---

# Phase 02 Plan 03: Tutorial Shell Components Summary

**Interactive tutorial shell with StepCard, AchievementOverlay, and LevelPage wiring complete navigation flow — 63 tests passing, build clean**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-04-03T21:41:00Z
- **Completed:** 2026-04-03T21:48:56Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- StepCard component with "Listo, ya lo hice" button, completed state (Check icon + pointer-events-none), and onLevelComplete callback for final steps
- AchievementOverlay modal with "Nivel X completado" heading, "Qué lograste" subheading, and level-aware CTA ("Ir al Nivel X+1" vs "Ver mi certificado")
- LevelPage orchestrating all components with step-by-step reveal logic, useProgress integration, and AchievementOverlay trigger
- Page route validates levels 0-6 with `notFound()` for invalid values
- All 22 Wave 0 test stubs from this plan replaced with real tests — all GREEN
- Full suite: 63 tests pass, 18 todo (useProgress/TutorialHeader/CodeBlock tests belong to 02-02)

## Task Commits

1. **Task 1: StepCard and AchievementOverlay** - `4392003` (feat)
2. **Task 2: LevelPage, page route, remaining stubs** - `3973a5c` (feat)

## Files Created/Modified

- `src/components/tutorial/StepCard.tsx` — Step card with completion button and completed state
- `src/components/tutorial/AchievementOverlay.tsx` — Modal overlay with level completion messaging
- `src/components/tutorial/LevelPage.tsx` — Level page orchestrator with step-by-step reveal
- `src/components/tutorial/TutorialHeader.tsx` — Sticky header with level badge and progress bar
- `src/components/tutorial/LockedLevel.tsx` — Lock gate with "Este nivel está bloqueado" and back button
- `src/components/tutorial/CodeBlock.tsx` — Dark code block with copy button
- `src/hooks/useProgress.ts` — localStorage + saveProgress dual-write hook
- `src/app/tutorial/[level]/page.tsx` — Server component page route validating levels 0-6
- `src/components/__tests__/StepCard.test.tsx` — 6 tests GREEN
- `src/components/__tests__/AchievementOverlay.test.tsx` — 7 tests GREEN
- `src/components/__tests__/LevelPage.test.tsx` — 5 tests GREEN
- `src/app/actions/__tests__/progress.test.ts` — 4 tests GREEN

## Decisions Made

- Created compatible implementations of useProgress, TutorialHeader, LockedLevel, CodeBlock since plan 02-02 runs in parallel and was not available in this worktree. These are functionally compatible — 02-02 may overwrite them with its versions.
- LevelPage renders TutorialHeader directly (not in tutorial layout) so the header can access useProgress state without a second hook instance.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed npm dependencies**
- **Found during:** Task 1 (running tests after writing StepCard)
- **Issue:** `lucide-react` and `@base-ui/react` were in `package.json` but not installed in the worktree's `node_modules`
- **Fix:** Ran `npm install` to install all declared dependencies
- **Files modified:** node_modules/ (no package.json change)
- **Verification:** Tests passed after install
- **Committed in:** Part of Task 1 commit `4392003`

**2. [Rule 3 - Blocking] Created 02-02 dependencies (useProgress, TutorialHeader, LockedLevel, CodeBlock)**
- **Found during:** Task 2 (creating LevelPage which imports these)
- **Issue:** Plan 02-02 (parallel) had not yet delivered these files to the worktree
- **Fix:** Created minimal compatible implementations matching the interfaces specified in the plan's `<interfaces>` section
- **Files modified:** src/hooks/useProgress.ts, src/components/tutorial/TutorialHeader.tsx, src/components/tutorial/LockedLevel.tsx, src/components/tutorial/CodeBlock.tsx
- **Verification:** All LevelPage tests pass, build passes
- **Committed in:** Task 2 commit `3973a5c`

---

**Total deviations:** 2 auto-fixed (both blocking — missing dependencies)
**Impact on plan:** Both auto-fixes required to unblock execution. No scope creep. 02-02 may overwrite the parallel-created files with its own implementations.

## Known Stubs

- `PLACEHOLDER_STEPS` in `LevelPage.tsx` — 3 hardcoded placeholder steps ("Contenido del paso X se agrega en Fase 3"). Phase 3 will replace these with real tutorial content.
- `summary` prop in `AchievementOverlay.tsx` defaults to placeholder text ("Placeholder — el contenido se agrega en la Fase 3."). Phase 3 will provide real summaries.

These stubs are intentional — they satisfy the Phase 2 shell requirement. Phase 3 wires real content.

## Issues Encountered

None beyond the blocking deviations documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Full tutorial navigation shell is complete and working
- Any level 0-6 can be navigated to; locked levels show gate screen
- Step completion flow, achievement overlay, and progress persistence all functional
- Phase 3 can drop in real content by replacing PLACEHOLDER_STEPS in LevelPage and providing level summaries to AchievementOverlay

---
*Phase: 02-tutorial-shell-progress-engine*
*Completed: 2026-04-03*
