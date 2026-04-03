---
phase: 3
slug: tutorial-content-7-levels
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` (project root) |
| **Quick run command** | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx src/lib/__tests__/content.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/__tests__/ErrorCallout.test.tsx src/lib/__tests__/content.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | CONT-02 | unit | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 0 | CONT-01, CONT-03, CONT-04 | unit | `npx vitest run src/lib/__tests__/content.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | CONT-02 | unit | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 1 | CONT-01, CONT-03, CONT-04 | unit | `npx vitest run src/lib/__tests__/content.test.ts` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 2 | CONT-01, CONT-02, CONT-03, CONT-04 | integration | `npx vitest run` | ❌ W0 | ⬜ pending |
| 3-05-01 | 05 | 3 | CONT-05 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/__tests__/ErrorCallout.test.tsx` — stubs for CONT-02 (renders trigger, error, solution; collapsible details element present)
- [ ] `src/lib/__tests__/content.test.ts` — stubs for CONT-01, CONT-03, CONT-04 (validates LEVEL_CONTENT shape: 7 entries, each has steps with codeBlock and errorCallouts, each has non-empty summary)

*CONT-05 has no automated test — manual UAT item in HUMAN-UAT.md*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All 7 levels completable in under 60 minutes | CONT-05 | Timing requires human walkthrough; "manually verified by creator" per requirement | Creator installs Claude Code fresh, completes all 7 levels start to finish, records elapsed time. Must be < 60 minutes. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
