---
phase: 04-certificate-sharing
plan: 01
subsystem: certificate
tags: [certificate, userId, ImageResponse, next/og, fonts, registration, session]
dependency_graph:
  requires:
    - src/db/schema.ts (users + progress tables)
    - src/app/actions/actions.ts (registerUser - now extended)
    - src/lib/session.ts (sessionId pattern - extended with userId)
    - src/components/RegistrationForm.tsx (setUserId call added)
  provides:
    - src/lib/certificate.ts (getUserForCertificate query helper)
    - src/app/api/certificate/[userId]/route.tsx (PNG generation endpoint)
    - public/fonts/Inter-Bold.ttf (font for ImageResponse)
    - public/fonts/Inter-Regular.ttf (font for ImageResponse)
    - src/lib/types/tutorial.ts (completedAt field)
    - src/lib/session.ts (getUserId/setUserId helpers)
  affects:
    - 04-02 (CertificatePage component needs userId from localStorage)
    - 04-03 (certificate page needs route.tsx to serve PNG)
tech_stack:
  added:
    - Inter TTF fonts (public/fonts/) - required by next/og ImageResponse for custom typography
  patterns:
    - next/og ImageResponse for server-side PNG generation from JSX
    - Satori CSS subset (flexbox only, literal hex values, no CSS variables)
    - params as Promise<{ userId: string }> in Next.js 16.x route handlers
    - vi.mock factory pattern with class-in-factory to avoid hoisting issues
key_files:
  created:
    - src/lib/certificate.ts
    - src/app/api/certificate/[userId]/route.tsx
    - public/fonts/Inter-Bold.ttf
    - public/fonts/Inter-Regular.ttf
    - src/lib/__tests__/certificate.test.ts
    - src/app/api/certificate/[userId]/__tests__/route.test.ts
    - src/app/certificate/[userId]/__tests__/page.test.ts
    - src/components/__tests__/CertificatePage.test.tsx
  modified:
    - src/lib/types/tutorial.ts (added completedAt field)
    - src/app/actions/actions.ts (added .returning(), userId in result)
    - src/app/actions/__tests__/register.test.ts (updated mock for .returning() chain)
    - src/lib/session.ts (added USER_ID_KEY, getUserId, setUserId)
    - src/components/RegistrationForm.tsx (added setUserId call)
decisions:
  - "route.tsx not route.ts: Vitest oxc transformer requires .tsx extension to parse JSX; Next.js App Router accepts both extensions"
  - "vi.mock factory with class-in-factory: avoids hoisting ReferenceError when mocking ImageResponse as constructor"
  - "completedAt in JSONB not new DB column: stored in existing TutorialProgress JSONB data field; no migration required"
metrics:
  duration: "~4 minutes"
  completed_date: "2026-04-04"
  tasks_completed: 2
  files_changed: 13
---

# Phase 04 Plan 01: Foundation Plumbing and Certificate PNG Generation Summary

userId-in-localStorage pattern established, getUserForCertificate query helper created, and GET /api/certificate/[userId] route handler generating branded PNG via next/og ImageResponse with Inter fonts, ZalesMachine branding, and Satori-compatible inline styles.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Types, userId plumbing, query helper, font assets, Wave 0 stubs | d4a2094 | 12 files (tutorial.ts, actions.ts, session.ts, RegistrationForm.tsx, certificate.ts, fonts, 4 test stubs) |
| 2 | Certificate PNG route handler with ImageResponse | 7a99d03 | 2 files (route.tsx, route.test.ts converted to real assertions) |

## What Was Built

**userId plumbing:** `registerUser` server action now returns `userId` alongside `sessionId` via `.returning({ id: users.id })`. `RegistrationForm` stores both in localStorage at registration time. `session.ts` exports `getUserId`/`setUserId` helpers with `USER_ID_KEY` constant.

**Query helper:** `getUserForCertificate(userId)` at `src/lib/certificate.ts` — joins `users` + `progress` tables via `leftJoin`, returns name, linkedinUrl, createdAt, progressData, progressUpdatedAt, or null if not found.

**Certificate PNG endpoint:** `GET /api/certificate/[userId]` at `src/app/api/certificate/[userId]/route.tsx` — loads Inter TTF fonts from `public/fonts/`, calls `getUserForCertificate`, returns 404 for unknown userId, returns `ImageResponse` PNG (1200×630) with: ZalesMachine wordmark (#D9ADFF), "Certificado de Finalización" label, user name (#FFFFFF, 48px), "Claude Code Mastery" (#E9FFB9), levels completed (#70B5FF), completion date from `completedAt` JSONB field or `progressUpdatedAt` fallback.

**Wave 0 test stubs:** 4 files with `it.todo()` covering certificate helper, route handler, page metadata, and CertificatePage component interactions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed register.test.ts mock to support .returning() chain**
- **Found during:** Task 1
- **Issue:** Existing `db.insert().values()` mock returned `undefined` (no `.returning()` method), causing 3 test failures after `registerUser` was changed to use `.returning({ id: users.id })`
- **Fix:** Updated mock to chain `.returning()` after `.values()`, returning `[{ id: '00000000-0000-0000-0000-000000000001' }]`
- **Files modified:** `src/app/actions/__tests__/register.test.ts`
- **Commit:** d4a2094

**2. [Rule 1 - Bug] route.tsx extension instead of route.ts**
- **Found during:** Task 2
- **Issue:** Vitest's oxc transformer failed to parse JSX in `route.ts` — oxc requires `.tsx` extension to activate JSX transform
- **Fix:** Named the file `route.tsx` (Next.js App Router accepts both `.ts` and `.tsx` for route handlers)
- **Files modified:** `src/app/api/certificate/[userId]/route.tsx`
- **Commit:** 7a99d03

**3. [Rule 1 - Bug] vi.mock factory with class-in-factory pattern for ImageResponse**
- **Found during:** Task 2 test writing
- **Issue:** `vi.mock` is hoisted; references to top-level variables (including classes defined before `vi.mock`) cause `ReferenceError: Cannot access before initialization`
- **Fix:** Defined the mock `ImageResponse` class inside the `vi.mock(() => { class ImageResponse ... })` factory
- **Files modified:** `src/app/api/certificate/[userId]/__tests__/route.test.ts`
- **Commit:** 7a99d03

### Out of Scope (Deferred)

**Pre-existing TypeScript errors in `src/app/actions/__tests__/progress.test.ts`:** 4 TS errors related to mock typing (`.limit()` type mismatch, `PgInsertBuilder` conversion). These pre-existed before this plan and are unrelated to certificate work. Logged to avoid confusion — not fixed per scope boundary rule.

## Known Stubs

- `src/lib/__tests__/certificate.test.ts`: 2 `it.todo()` stubs for getUserForCertificate (no implementation yet — wave pattern)
- `src/app/certificate/[userId]/__tests__/page.test.ts`: 3 `it.todo()` stubs for generateMetadata (page not yet built — Plan 02)
- `src/components/__tests__/CertificatePage.test.tsx`: 5 `it.todo()` stubs for CertificatePage component (not yet built — Plan 02)

These stubs are intentional Wave 0 placeholders per Phase 2 decision (`it.todo()` not `it.skip()`). They will be implemented in Plan 02 and Plan 03.

## Self-Check: PASSED

All created files verified present. Both task commits verified in git log.

| Check | Result |
|-------|--------|
| src/lib/certificate.ts | FOUND |
| src/app/api/certificate/[userId]/route.tsx | FOUND |
| public/fonts/Inter-Bold.ttf | FOUND |
| public/fonts/Inter-Regular.ttf | FOUND |
| src/lib/__tests__/certificate.test.ts | FOUND |
| src/app/api/certificate/[userId]/__tests__/route.test.ts | FOUND |
| src/app/certificate/[userId]/__tests__/page.test.ts | FOUND |
| src/components/__tests__/CertificatePage.test.tsx | FOUND |
| Commit d4a2094 | FOUND |
| Commit 7a99d03 | FOUND |
