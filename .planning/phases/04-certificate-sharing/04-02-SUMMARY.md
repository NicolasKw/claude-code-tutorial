---
phase: 04-certificate-sharing
plan: "02"
subsystem: ui
tags: [nextjs, react, metadata, og-tags, lucide-react, testing-library, clipboard-api]

# Dependency graph
requires:
  - phase: 04-01
    provides: getUserForCertificate function, GET /api/certificate/[userId] route, session utilities

provides:
  - Public /certificate/[userId] server component with generateMetadata (og:image, og:title, og:description)
  - CertificatePage client component with download (fetch+blob), LinkedIn share (window.open), copy (clipboard API)
  - Passing tests for OG metadata correctness and all 3 interaction patterns

affects:
  - 04-03 (verification plan — can now test the full certificate page flow)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server component exports generateMetadata for dynamic OG tags using async params"
    - "NEXT_PUBLIC_BASE_URL env var for absolute og:image URLs"
    - "fetch+blob+URL.createObjectURL+a.download pattern for file download (no window.open)"
    - "navigator.clipboard.writeText with 2s copied state via useState+setTimeout"
    - "document.createElement spy pattern in tests to verify programmatic anchor creation"

key-files:
  created:
    - src/app/certificate/[userId]/page.tsx
    - src/components/certificate/CertificatePage.tsx
  modified:
    - src/app/certificate/[userId]/__tests__/page.test.ts
    - src/components/__tests__/CertificatePage.test.tsx

key-decisions:
  - "Used ExternalLink icon instead of Linkedin — lucide-react version installed has no LinkedIn icon"
  - "Download test uses document.createElement spy to capture programmatic anchor, not DOM query, because jsdom removes the element after programmatic click"
  - "Copy test uses Promise.resolve() instead of vi.runAllMicrotasks() — that API does not exist in this vitest version"

patterns-established:
  - "OG metadata pattern: generateMetadata with async params + NEXT_PUBLIC_BASE_URL fallback"
  - "Download without new tab: fetch blob → URL.createObjectURL → anchor.click() → revokeObjectURL"
  - "Copied state: useState(false) + setTimeout 2000ms to reset"

requirements-completed: [CERT-02, CERT-03, CERT-04, CERT-05]

# Metrics
duration: 3min
completed: 2026-04-04
---

# Phase 04 Plan 02: Certificate Page Summary

**Public /certificate/[userId] page with OG meta tags (og:image absolute URL, og:title, og:description) and CertificatePage client component implementing download (fetch+blob), LinkedIn share (window.open), and clipboard copy with 2s "Copiado" state**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T01:13:33Z
- **Completed:** 2026-04-04T01:17:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created public server component `/certificate/[userId]/page.tsx` with `generateMetadata` returning correct og:image (absolute URL), og:title, og:description, og:url — no SessionGuard
- Created `CertificatePage` client component with all 3 action buttons: download (fetch+blob+a.download), LinkedIn share (window.open), clipboard copy with 2s Copiado feedback
- Certificate preview with onLoad skeleton and onError error state; post copy block shows pre-written text with user name
- 10 passing tests across both test files (5 OG meta + 5 interaction tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: Certificate page server component with generateMetadata** - `97e753d` (feat)
2. **Task 2: CertificatePage client component with download, share, and copy** - `7f33511` (feat)

**Plan metadata:** (see below)

## Files Created/Modified
- `src/app/certificate/[userId]/page.tsx` - Public server component with generateMetadata and CertificatePage rendering
- `src/components/certificate/CertificatePage.tsx` - Client component with download, LinkedIn share, clipboard copy interactions
- `src/app/certificate/[userId]/__tests__/page.test.ts` - 5 tests verifying OG metadata correctness
- `src/components/__tests__/CertificatePage.test.tsx` - 5 tests verifying download, share, copy, post text, and copied state duration

## Decisions Made
- Used `ExternalLink` icon instead of `Linkedin` — the installed version of lucide-react does not export a `Linkedin` icon. `ExternalLink` is a suitable substitute that communicates external link behavior.
- Download test uses `vi.spyOn(document, 'createElement')` to capture the programmatic anchor element — jsdom removes the element after `.click()` so DOM queries find nothing.
- Copy state test uses `Promise.resolve()` for microtask flushing — `vi.runAllMicrotasks()` does not exist in this vitest version.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lucide-react has no Linkedin icon export**
- **Found during:** Task 2 (CertificatePage component)
- **Issue:** `import { Linkedin } from 'lucide-react'` causes TypeScript error — icon not available in installed version
- **Fix:** Replaced with `ExternalLink` icon which communicates external link behavior appropriately
- **Files modified:** src/components/certificate/CertificatePage.tsx
- **Verification:** TypeScript compilation passes, tests pass
- **Committed in:** 7f33511 (Task 2 commit)

**2. [Rule 1 - Bug] Test type error on OGImage URL access**
- **Found during:** Task 1 (page.test.ts)
- **Issue:** `OGImage` type is `URL | OGImageDescriptor` — accessing `.url` directly causes TypeScript error because `URL` type doesn't have `.url` property
- **Fix:** Added type narrowing: `firstImage instanceof URL ? firstImage.toString() : (firstImage as any)?.url`
- **Files modified:** src/app/certificate/[userId]/__tests__/page.test.ts
- **Verification:** TypeScript compilation passes, tests pass
- **Committed in:** 97e753d (Task 1 commit)

**3. [Rule 1 - Bug] Test timing issues with fake timers and waitFor/runAllMicrotasks**
- **Found during:** Task 2 (CertificatePage.test.tsx)
- **Issue 1:** `vi.runAllMicrotasks()` does not exist in this vitest version; `waitFor` + fake timers causes 5s timeout
- **Issue 2:** Download test queries DOM for `<a download>` but jsdom removes element after programmatic click
- **Fix 1:** Used `Promise.resolve()` for microtask flushing; used `vi.runAllTimersAsync()` for async timer advancement
- **Fix 2:** Spied on `document.createElement` to capture anchor before click
- **Files modified:** src/components/__tests__/CertificatePage.test.tsx
- **Verification:** All 5 tests pass
- **Committed in:** 7f33511 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 1 bugs — unavailable icon, type narrowing, test API differences)
**Impact on plan:** All auto-fixes necessary for TypeScript correctness and test reliability. No scope creep. Functional behavior matches spec exactly.

## Issues Encountered
None beyond the auto-fixed deviations above.

## Next Phase Readiness
- Certificate page is fully functional: public URL, correct OG meta tags, all 3 actions working
- Ready for Phase 04 Plan 03 (verification)
- NEXT_PUBLIC_BASE_URL must be set in `.env.local` and Vercel env vars for production og:image to be absolute

## Self-Check: PASSED

- FOUND: src/app/certificate/[userId]/page.tsx
- FOUND: src/components/certificate/CertificatePage.tsx
- FOUND: .planning/phases/04-certificate-sharing/04-02-SUMMARY.md
- FOUND commit: 97e753d
- FOUND commit: 7f33511

---
*Phase: 04-certificate-sharing*
*Completed: 2026-04-04*
