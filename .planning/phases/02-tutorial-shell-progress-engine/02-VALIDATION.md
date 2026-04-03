---
phase: 2
slug: tutorial-shell-progress-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + Testing Library React 16.3.2 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-W0-01 | W0 | 0 | TUTO-01 | unit | `npm test -- progress` | ❌ W0 | ⬜ pending |
| 02-W0-02 | W0 | 0 | TUTO-01 | unit | `npm test -- LevelPage` | ❌ W0 | ⬜ pending |
| 02-W0-03 | W0 | 0 | TUTO-02 | unit | `npm test -- AchievementOverlay` | ❌ W0 | ⬜ pending |
| 02-W0-04 | W0 | 0 | TUTO-03 | unit | `npm test -- StepCard` | ❌ W0 | ⬜ pending |
| 02-W0-05 | W0 | 0 | TUTO-04 | unit | `npm test -- useProgress` | ❌ W0 | ⬜ pending |
| 02-W0-06 | W0 | 0 | TUTO-04 | unit | `npm test -- progress.action` | ❌ W0 | ⬜ pending |
| 02-W0-07 | W0 | 0 | TUTO-05 | unit | `npm test -- CodeBlock` | ❌ W0 | ⬜ pending |
| 02-W0-08 | W0 | 0 | TUTO-06 | unit | `npm test -- TutorialHeader` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/progress.test.ts` — `isLevelLocked()`, `completeLevel()` pure logic (TUTO-01)
- [ ] `src/hooks/__tests__/useProgress.test.ts` — hook: init from localStorage, completeStep, completeLevel (TUTO-03, TUTO-04)
- [ ] `src/components/__tests__/TutorialHeader.test.tsx` — "Nivel X de 7" badge, progress bar aria-valuenow (TUTO-06)
- [ ] `src/components/__tests__/LevelPage.test.tsx` — renders LockedLevel when locked, content when unlocked (TUTO-01)
- [ ] `src/components/__tests__/StepCard.test.tsx` — "Listo, ya lo hice" marks step complete, triggers onLevelComplete on final step (TUTO-03)
- [ ] `src/components/__tests__/AchievementOverlay.test.tsx` — renders when show=true, "Ver mi certificado" on level 7 (TUTO-02)
- [ ] `src/components/__tests__/CodeBlock.test.tsx` — clipboard.writeText called, Check icon shown for 2s (TUTO-05)
- [ ] `src/app/actions/__tests__/progress.test.ts` — saveProgress calls DB upsert with correct userId (TUTO-04)

**navigator.clipboard mock** (add to test files that test CodeBlock):
```typescript
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});
```

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Achievement overlay fade-in animation (200ms) | TUTO-02 | CSS animation — jsdom does not run transitions | Navigate to /tutorial/1, complete all steps, verify overlay fades in smoothly |
| Step reveal fade-in (150ms) | TUTO-03 | CSS animation | Complete a step, verify next step appears with fade |
| Progress bar fill animation (300ms) | TUTO-06 | CSS transition | Complete a level, verify progress bar fills smoothly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
