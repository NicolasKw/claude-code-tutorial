---
phase: 4
slug: certificate-sharing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` (project root) |
| **Quick run command** | `npm test -- --reporter=verbose src/components/__tests__/CertificatePage.test.tsx` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --reporter=verbose src/components/__tests__/CertificatePage.test.tsx`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01 | route handler | 1 | CERT-01 | unit (mocked DB) | `npm test -- src/app/api/certificate` | ❌ W0 | ⬜ pending |
| 4-02 | cert user name | 1 | CERT-01 | unit (ImageResponse mock) | `npm test -- src/app/api/certificate` | ❌ W0 | ⬜ pending |
| 4-03 | generateMetadata | 1 | CERT-02 | unit | `npm test -- src/app/certificate` | ❌ W0 | ⬜ pending |
| 4-04 | og:image absolute | 1 | CERT-02 | unit | `npm test -- src/app/certificate` | ❌ W0 | ⬜ pending |
| 4-05 | download button | 2 | CERT-03 | unit (mock fetch) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ W0 | ⬜ pending |
| 4-06 | LinkedIn share | 2 | CERT-04 | unit (mock window.open) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ W0 | ⬜ pending |
| 4-07 | clipboard copy | 2 | CERT-05 | unit (mock clipboard) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ W0 | ⬜ pending |
| 4-08 | post text content | 2 | CERT-05 | unit | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/app/api/certificate/[userId]/__tests__/route.test.ts` — covers CERT-01
- [ ] `src/app/certificate/[userId]/__tests__/page.test.ts` — covers CERT-02
- [ ] `src/components/__tests__/CertificatePage.test.tsx` — covers CERT-03, CERT-04, CERT-05
- [ ] `src/lib/__tests__/certificate.test.ts` — covers getUserForCertificate query helper

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| LinkedIn Post Inspector shows correct preview image | CERT-02 | Requires deployed URL + LinkedIn's external crawler | Use https://www.linkedin.com/post-inspector/ with deployed certificate URL |
| Visual review of certificate PNG layout and branding | CERT-01 | Layout/design correctness not automatable | Load `/api/certificate/[userId]` in browser, verify ZalesMachine branding, name, date visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
