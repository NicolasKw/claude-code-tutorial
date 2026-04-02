---
phase: 1
slug: foundation-registration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (native ESM, faster than Jest) |
| **Config file** | `vitest.config.ts` — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| DB schema + connection | 01 | 1 | AUTH-01 | unit | `npx vitest run src/lib/db` | ❌ W0 | ⬜ pending |
| Registration Server Action | 01 | 1 | AUTH-01 | unit | `npx vitest run src/app/actions/register` | ❌ W0 | ⬜ pending |
| LinkedIn URL validation | 01 | 1 | AUTH-01 | unit | `npx vitest run src/lib/validate` | ❌ W0 | ⬜ pending |
| RegistrationForm component | 01 | 2 | AUTH-01 | component | `npx vitest run src/components/RegistrationForm` | ❌ W0 | ⬜ pending |
| SessionGuard redirect | 01 | 2 | AUTH-02, AUTH-03 | component | `npx vitest run src/components/SessionGuard` | ❌ W0 | ⬜ pending |
| localStorage persistence | 01 | 2 | AUTH-02 | unit | `npx vitest run src/lib/session` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/validate.test.ts` — LinkedIn URL validation unit tests
- [ ] `src/app/actions/__tests__/register.test.ts` — Server Action unit tests (mocked DB)
- [ ] `src/lib/__tests__/session.test.ts` — localStorage get/set/clear unit tests
- [ ] `src/components/__tests__/RegistrationForm.test.tsx` — form render + submit stubs
- [ ] `src/components/__tests__/SessionGuard.test.tsx` — redirect behavior stubs
- [ ] `vitest.config.ts` — Vitest configuration with jsdom environment
- [ ] `npx vitest` — install via `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Form submits and redirects to /tutorial/1 in real browser | AUTH-01 | Requires real browser + Neon connection | Fill form, submit, verify redirect and DB record in Neon console |
| Session persists after browser close and reopen | AUTH-02 | Requires real browser localStorage | Register, close tab, reopen app, verify landing on /tutorial/1 |
| Unregistered visitor redirected to landing | AUTH-03 | Requires real browser routing | Open /tutorial/1 in incognito, verify redirect to / |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
