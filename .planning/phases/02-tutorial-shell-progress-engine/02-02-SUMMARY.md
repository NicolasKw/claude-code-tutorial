---
phase: 02-tutorial-shell-progress-engine
plan: 02
subsystem: tutorial-components
tags: [react-hooks, components, tdd, progress-engine, localStorage]
dependency_graph:
  requires: [02-01]
  provides: [useProgress hook, CodeBlock, TutorialHeader, LockedLevel]
  affects: [02-03, 02-04]
tech_stack:
  added: ["@base-ui/react@1.3.0 (installed — was in package.json but missing from node_modules)"]
  patterns: ["dual-write localStorage + server action", "base-ui Progress for accessible progressbar", "lucide Copy/Check icon swap"]
key_files:
  created:
    - src/hooks/useProgress.ts
    - src/components/tutorial/CodeBlock.tsx
    - src/components/tutorial/TutorialHeader.tsx
    - src/components/tutorial/LockedLevel.tsx
  modified:
    - src/hooks/__tests__/useProgress.test.ts
    - src/components/__tests__/CodeBlock.test.tsx
    - src/components/__tests__/TutorialHeader.test.tsx
    - src/test-setup.ts
decisions:
  - "Added @testing-library/jest-dom import to test-setup.ts — required for toBeInTheDocument matcher (was not configured)"
  - "Used await act(async => fireEvent.click) for CodeBlock copy tests — async clipboard API requires act wrapper"
  - "TutorialHeader uses shadcn Progress (base-ui/react) — renders aria-valuenow, aria-valuemin, aria-valuemax correctly for WCAG progressbar role"
  - "LockedLevel uses useRouter for back navigation — 'use client' directive required"
metrics:
  duration_minutes: 3
  completed_date: "2026-04-03"
  tasks_completed: 2
  files_changed: 8
---

# Phase 02 Plan 02: useProgress Hook + Tutorial Components Summary

useProgress hook with localStorage + server action dual-write, CodeBlock with 1-click copy, TutorialHeader with sticky progress badge, and LockedLevel gate — 32 tests GREEN.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Fill progress/useProgress stubs, create useProgress hook | cdc2efa | src/hooks/useProgress.ts, src/hooks/__tests__/useProgress.test.ts |
| 2 | Build CodeBlock, TutorialHeader, LockedLevel and fill test stubs | 50a40c3 | src/components/tutorial/{CodeBlock,TutorialHeader,LockedLevel}.tsx, src/components/__tests__/{CodeBlock,TutorialHeader}.test.tsx, src/test-setup.ts |

## Test Results

| Test File | Tests | Status |
|-----------|-------|--------|
| src/lib/__tests__/progress.test.ts | 17 | PASS (pre-existing from Wave 1) |
| src/hooks/__tests__/useProgress.test.ts | 7 | PASS |
| src/components/__tests__/TutorialHeader.test.tsx | 5 | PASS |
| src/components/__tests__/CodeBlock.test.tsx | 6 | PASS |
| **Total** | **35** | **GREEN** |

Note: progress.test.ts had 17 passing tests (not 14 as planned — 3 extra isStepCompleted tests were already implemented in Wave 1). All Wave 0 stubs from useProgress.test.ts, TutorialHeader.test.tsx, and CodeBlock.test.tsx were filled in and passing.

## Decisions Made

1. **@testing-library/jest-dom not imported in test-setup.ts** — Added import to enable `toBeInTheDocument`, `toHaveAttribute`, `toHaveClass` matchers (Rule 3 auto-fix — blocking issue for component tests).

2. **CodeBlock tests use `await act(async => {...})`** — The click handler awaits `navigator.clipboard.writeText()`, which causes async state updates. Wrapping in `act` ensures state settles before assertions.

3. **TutorialHeader tests check `aria-valuenow` via `getByRole('progressbar')`** — The base-ui Progress.Root renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes. Tests match this API.

4. **LockedLevel uses `useRouter` from `next/navigation`** — Enables programmatic navigation to `/tutorial/{currentLevel}`. Required `'use client'` directive.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Setup] Added jest-dom to test-setup.ts**
- **Found during:** Task 2 (CodeBlock tests)
- **Issue:** `toBeInTheDocument` not registered — `@testing-library/jest-dom` was in package.json but never imported in test-setup.ts
- **Fix:** Added `import '@testing-library/jest-dom';` to `src/test-setup.ts`
- **Files modified:** `src/test-setup.ts`
- **Commit:** 50a40c3

**2. [Rule 3 - Blocking] Installed @base-ui/react**
- **Found during:** Task 2 (TutorialHeader which uses shadcn Progress)
- **Issue:** `@base-ui/react` was in package.json but not installed in node_modules (likely not installed in worktree)
- **Fix:** Ran `npm install @base-ui/react`
- **Files modified:** `package-lock.json`
- **Commit:** 50a40c3

**3. [Rule 1 - Bug] CodeBlock test stubs used unaccented aria-labels**
- **Found during:** Task 2
- **Issue:** The original `it.todo` stub descriptions used "Código copiado" (with accent) but the component needed to match. Confirmed aria-labels must include proper Spanish diacritics.
- **Fix:** Component uses `'Código copiado'` and `'Copiar código'` (with accents). Tests match.

## Known Stubs

None — all components are fully wired with real functionality.

## Self-Check: PASSED

- src/hooks/useProgress.ts: FOUND
- src/components/tutorial/CodeBlock.tsx: FOUND
- src/components/tutorial/TutorialHeader.tsx: FOUND
- src/components/tutorial/LockedLevel.tsx: FOUND
- Commit cdc2efa: FOUND
- Commit 50a40c3: FOUND
