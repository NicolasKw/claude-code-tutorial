---
phase: 01-foundation-registration
plan: 01
subsystem: infrastructure
tags: [nextjs, drizzle, neon, zod, vitest, typescript, tailwind, postgresql]

# Dependency graph
requires: []
provides:
  - Next.js 16.2.2 app with TypeScript + Tailwind v4 + ESLint + App Router
  - Drizzle ORM connected to Neon Postgres via HTTP driver
  - Users table schema (id, name, linkedin_url, email nullable, session_id unique, created_at)
  - Zod registrationSchema with LinkedIn URL validation and normalization
  - localStorage session helpers (getSessionId, setSessionId, clearSession)
  - Vitest test suite with jsdom environment (12 tests green)
affects:
  - 01-02 (registration feature will use all of these)
  - all subsequent phases (builds on this foundation)

# Tech tracking
tech-stack:
  added:
    - next@16.2.2
    - drizzle-orm@0.45.2
    - @neondatabase/serverless@1.0.2
    - zod@4.3.6
    - drizzle-kit@0.31.10
    - vitest@4.1.2
    - jsdom@29.0.1
    - "@testing-library/react@16.3.2"
    - tailwindcss@4
  patterns:
    - Neon HTTP driver pattern for serverless Postgres connections
    - Zod .safeParse() with .flatten().fieldErrors for structured validation errors
    - Zod .transform() for URL normalization (linkedin.com/in/x -> https://...)
    - typeof window === 'undefined' guard for SSR-safe localStorage access
    - TDD RED-GREEN cycle with vitest

key-files:
  created:
    - src/db/schema.ts
    - src/db/index.ts
    - src/lib/validations.ts
    - src/lib/session.ts
    - src/lib/__tests__/validations.test.ts
    - src/lib/__tests__/session.test.ts
    - src/test-setup.ts
    - vitest.config.ts
    - drizzle.config.ts
    - .env.example
  modified:
    - package.json (added test script + dependencies)
    - .gitignore (added !.env.example exception)

key-decisions:
  - "Scaffolded with --disable-git to avoid create-next-app overwriting existing .git; .planning and .claude temporarily moved during scaffold"
  - "Added custom localStorage mock in src/test-setup.ts because vitest's jsdom --localstorage-file flag disables the standard localStorage.clear() method"
  - "Used only path alias resolution in vitest.config.ts (no @vitejs/plugin-react) per plan instructions to avoid Next.js conflicts"

patterns-established:
  - "TDD pattern: write failing test -> commit -> implement -> verify green"
  - "Drizzle schema pattern: uuid PK with defaultRandom(), nullable email as text() without .notNull()"
  - "Session pattern: UUID stored in localStorage with typeof window guard for SSR safety"

requirements-completed:
  - AUTH-01
  - AUTH-02

# Metrics
duration: 6min
completed: 2026-04-02
---

# Phase 1 Plan 01: Foundation Scaffold Summary

**Next.js 16.2.2 + Drizzle/Neon + Zod registrationSchema + localStorage session helpers + 12 Vitest tests green**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-02T19:52:56Z
- **Completed:** 2026-04-02T19:58:28Z
- **Tasks:** 2 completed
- **Files modified:** 16 (excluding .claude tooling)

## Accomplishments

- Next.js app scaffolded from scratch with TypeScript + Tailwind v4 + App Router into the existing project directory (with planning/tooling preserved)
- Drizzle ORM + Neon serverless driver installed and configured with users table schema (id, name, linkedin_url, email nullable, session_id unique UUID, created_at)
- Zod registrationSchema validates name + LinkedIn profile URL (with regex + normalization transform) + optional email
- localStorage session helpers (getSessionId/setSessionId/clearSession) with SSR-safe typeof window guard
- Vitest configured with jsdom environment; 12 tests all green (8 validation, 4 session)

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js app, install dependencies, configure Vitest and Drizzle** - `ec7fed8` (feat)
2. **Task 1b: Track .env.example** - `5fd89d3` (chore)
3. **Task 2 RED: Failing validations tests** - `a296120` (test)
4. **Task 2 RED: Failing session tests** - `f26e48a` (test)
5. **Task 2 GREEN: Implement validations, session, vitest setup** - `f427d96` (feat)

**Plan metadata:** pending final commit (docs)

_Note: TDD tasks have multiple commits (test RED -> feat GREEN)_

## Files Created/Modified

- `src/db/schema.ts` - Users table with all required columns (id, name, linkedin_url, email nullable, session_id unique, created_at)
- `src/db/index.ts` - Drizzle db instance using Neon HTTP driver
- `src/lib/validations.ts` - Zod registrationSchema with LINKEDIN_PROFILE_REGEX and URL transform
- `src/lib/session.ts` - localStorage helpers with SSR window guard
- `src/lib/__tests__/validations.test.ts` - 8 validation test cases
- `src/lib/__tests__/session.test.ts` - 4 session test cases
- `src/test-setup.ts` - Custom localStorage mock for jsdom compatibility
- `vitest.config.ts` - Vitest config with jsdom environment, path alias, test-setup
- `drizzle.config.ts` - Drizzle Kit configuration pointing to Neon + schema
- `.env.example` - DATABASE_URL placeholder template
- `.env.local` - DATABASE_URL placeholder (gitignored)
- `package.json` - Added test script and all dependencies

## Decisions Made

- Used `--disable-git` with create-next-app to prevent it from reinitializing git, then manually restored `.planning/` and `.claude/` directories after scaffolding
- Added custom localStorage mock in `src/test-setup.ts` because vitest's jsdom environment passes `--localstorage-file` which disables the native `localStorage.clear()` method
- Followed plan instruction: NO `@vitejs/plugin-react` in vitest.config.ts (only path aliases) to avoid conflicts with Next.js's Babel/SWC setup

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed localStorage.clear() not available in vitest jsdom environment**
- **Found during:** Task 2 (session tests GREEN phase)
- **Issue:** `vitest run` with jsdom environment passes `--localstorage-file` flag which creates a file-backed localStorage mock that doesn't implement the `clear()` method
- **Fix:** Created `src/test-setup.ts` with a proper in-memory localStorage mock, registered in vitest.config.ts `setupFiles`
- **Files modified:** `src/test-setup.ts`, `vitest.config.ts`
- **Verification:** All 4 session tests pass including `clearSession` test
- **Committed in:** `f427d96` (Task 2 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Required fix for test environment compatibility. No scope creep. All planned functionality delivered.

## Issues Encountered

- `create-next-app` refused to scaffold into a non-empty directory even with `--yes` flag — resolved by temporarily moving `.planning/` and `.claude/` to `/tmp/`, scaffolding, then restoring. The `--disable-git` flag prevented reinitializing git.

## User Setup Required

**External services require manual configuration.** See the inline notes for Neon setup:

- **DATABASE_URL**: Create a Neon project at https://console.neon.tech, copy the connection string into `.env.local`
- After setting DATABASE_URL: run `npx drizzle-kit push` to create the users table in Neon
- `.env.local` is gitignored — never commit the real database URL

## Next Phase Readiness

- App skeleton compiles cleanly (`npm run build` passes)
- All 12 tests green (`npx vitest run` passes)
- DB schema ready for Neon once DATABASE_URL is provided
- `registrationSchema` and session helpers ready for Plan 02 to wire into the registration form and Server Action

## Self-Check: PASSED

- src/db/schema.ts: FOUND
- src/db/index.ts: FOUND
- src/lib/validations.ts: FOUND
- src/lib/session.ts: FOUND
- vitest.config.ts: FOUND
- drizzle.config.ts: FOUND
- .env.example: FOUND
- Commits ec7fed8, f427d96, a296120, f26e48a: ALL FOUND
- `npx vitest run`: 12 tests passed (2 test files)
- `npm run build`: compiled successfully

---
*Phase: 01-foundation-registration*
*Completed: 2026-04-02*
