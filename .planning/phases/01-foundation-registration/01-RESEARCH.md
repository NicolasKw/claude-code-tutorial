# Phase 1: Foundation + Registration — Research

**Researched:** 2026-04-02
**Domain:** Next.js 15 App Router + Neon Postgres + Drizzle ORM + Tailwind v4 + localStorage session
**Confidence:** HIGH (stack well-documented, patterns verified from official sources)

---

## Important: Stack Discrepancy Resolved

The existing `.planning/research/STACK.md` and `ARCHITECTURE.md` were written when the plan was to use LinkedIn OAuth + Auth.js v5. **That approach has been superseded.** Per the current REQUIREMENTS.md (AUTH-01) and phase brief, the auth mechanism is:

- A simple HTML form: name (required), LinkedIn profile URL (required), email (optional)
- Session via UUID stored in `localStorage` — NO Auth.js, NO OAuth, NO cookies for session
- Route protection is client-side only (localStorage check), NOT server-side middleware

This research reflects the current spec. Treat STACK.md/ARCHITECTURE.md OAuth sections as outdated.

---

## Summary

This phase bootstraps a greenfield Next.js 15 App Router project and implements a lightweight registration flow. There is no existing code — the project root contains only `.planning/` and `.claude/` directories. The app must be created from scratch with `create-next-app`.

The session model is intentionally simple: on registration, the server writes a user record to Neon Postgres and returns a UUID session ID. The client stores that UUID in `localStorage`. All subsequent visits check `localStorage` for the session ID; if present, the user is considered registered. Route protection for `/tutorial/*` is a client-side redirect pattern (via `useEffect` in a layout or middleware-equivalent component), because Next.js middleware runs server-side and cannot read `localStorage`.

The Neon + Drizzle stack is standard and well-supported. Migrations are run via `drizzle-kit push` in development and `drizzle-kit migrate` in production (CI/Vercel build step).

**Primary recommendation:** Use Server Actions for form submission and data persistence; use a `useEffect`-based session guard in the `/tutorial/` layout for client-side route protection; store only the session UUID in `localStorage` (never sensitive data).

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can access tutorial by completing a simple registration form: name + LinkedIn profile URL (required) + email (optional). No OAuth, no login. | Server Action + Zod validation + Drizzle insert — fully covered |
| AUTH-02 | On registration, user progress and data persist in DB linked to a session ID stored in localStorage. User can continue from the same browser. | UUID generated server-side, returned to client, stored in localStorage — pattern verified |
| AUTH-03 | Routes `/tutorial/*` require completed registration. Unregistered users are redirected to landing page. | Client-side useEffect guard in tutorial layout — only viable pattern without cookies |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.2 | Framework — App Router, Server Actions, API routes | Official stack choice |
| react | 19.2.4 | UI | Peer dep of Next.js 16 |
| typescript | 6.0.2 | Type safety | Prevents runtime errors in solo project |
| tailwindcss | 4.2.2 | Styling | Chosen stack; v4 removes tailwind.config.js |
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind v4 | Required by Tailwind v4 — separate package |
| drizzle-orm | 0.45.2 | Type-safe ORM | Chosen stack; lightweight |
| @neondatabase/serverless | 1.0.2 | Neon HTTP driver | Serverless-optimized — no persistent connections |
| drizzle-kit | 0.31.10 | Migration CLI | Paired with drizzle-orm |
| zod | 4.3.6 | Schema validation | Server Action input validation; ecosystem standard |
| uuid | 13.0.0 | UUID generation for session IDs | Crypto-quality random IDs; no auth library needed |

**Note on versions:** Verified against npm registry on 2026-04-02. Next.js is currently at 16.x (React 19.x peer). Confirm with `npm view next version` before scaffolding.

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| dotenv | latest | Load .env in drizzle.config.ts | Only for migration scripts; Next.js loads .env.local natively |
| tsx | latest | Run TypeScript scripts (drizzle.config.ts) | Required by drizzle-kit |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| uuid (npm) | `crypto.randomUUID()` (built-in Node 19+) | Built-in is zero-dep; available in Node.js runtime but NOT in Edge Runtime. Use `crypto.randomUUID()` in Server Actions (Node runtime) and avoid uuid package if possible. |
| Zod for validation | Manual checks | Zod provides parse+type narrowing in one step; manual checks don't narrow types |
| drizzle-kit push | drizzle-kit migrate | `push` is instant for dev; `migrate` is safer for prod (tracks migration history). Use both: push locally, generate+migrate for CI/prod. |

**Installation:**
```bash
# Step 1: scaffold (creates Next.js 16 + TypeScript + Tailwind v4 + ESLint + App Router)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Step 2: Drizzle + Neon
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit tsx dotenv

# Step 3: Zod
npm install zod

# Note: uuid NOT needed — use crypto.randomUUID() from Node.js built-in
```

**Tailwind v4 note:** `create-next-app` as of 2026 installs Tailwind v4 automatically with `--tailwind`. If it installs v3, manually upgrade: `npm install tailwindcss@latest @tailwindcss/postcss postcss`.

**Version verification:**
```bash
npm view next version           # 16.2.2 as of 2026-04-02
npm view tailwindcss version    # 4.2.2
npm view drizzle-orm version    # 0.45.2
npm view @neondatabase/serverless version  # 1.0.2
npm view drizzle-kit version    # 0.31.10
npm view zod version            # 4.3.6
```

---

## Architecture Patterns

### Recommended Project Structure

```
/                               # project root (Next.js app IS the root)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root layout (html, body, Tailwind globals)
│   │   ├── page.tsx            # landing + registration form (public)
│   │   ├── globals.css         # @import "tailwindcss";
│   │   ├── tutorial/
│   │   │   └── [level]/
│   │   │       └── page.tsx    # tutorial level page (auth-gated, Phase 2)
│   │   └── api/
│   │       └── register/
│   │           └── route.ts    # POST: create user + return session ID
│   ├── db/
│   │   ├── index.ts            # Drizzle db instance
│   │   └── schema.ts           # table definitions
│   ├── lib/
│   │   ├── session.ts          # localStorage get/set helpers (client-only)
│   │   └── validations.ts      # Zod schemas (shared client+server)
│   └── components/
│       ├── RegistrationForm.tsx    # "use client" form component
│       └── SessionGuard.tsx        # "use client" auth gate for tutorial layout
├── drizzle/                    # generated migration files
├── drizzle.config.ts           # Drizzle Kit config
├── .env.local                  # DATABASE_URL (gitignored)
└── next.config.ts
```

### Pattern 1: Drizzle + Neon Connection

**What:** Initialize a single `db` instance using the Neon HTTP driver. Import it anywhere (Server Actions, Route Handlers, Server Components).

**When to use:** Every DB operation.

```typescript
// src/db/index.ts
// Source: https://orm.drizzle.team/docs/get-started/neon-new
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### Pattern 2: Drizzle Schema — Users Table

**What:** Define the two tables needed for Phase 1. Progress table is added here to unblock Phase 2.

```typescript
// src/db/schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
  email: text('email'),   // nullable — email is optional per AUTH-01
  sessionId: uuid('session_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

Note: `defaultRandom()` in Drizzle uses `gen_random_uuid()` in Postgres — no `uuid-ossp` extension needed on Neon.

### Pattern 3: Drizzle Config

```typescript
// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Pattern 4: Server Action for Registration

**What:** A Server Action that validates form data, inserts a user, and returns a session UUID to the client.

**When to use:** The registration form submit handler.

```typescript
// src/app/actions.ts
'use server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { registrationSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';

export type RegistrationResult =
  | { success: true; sessionId: string }
  | { success: false; errors: Record<string, string[]> };

export async function registerUser(
  _prevState: RegistrationResult | null,
  formData: FormData
): Promise<RegistrationResult> {
  const raw = {
    name: formData.get('name'),
    linkedinUrl: formData.get('linkedinUrl'),
    email: formData.get('email') || undefined,
  };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const sessionId = crypto.randomUUID();  // Node.js built-in — no uuid package needed

  await db.insert(users).values({
    name: parsed.data.name,
    linkedinUrl: parsed.data.linkedinUrl,
    email: parsed.data.email ?? null,
    sessionId,
  });

  // Return sessionId to client — client stores it in localStorage
  return { success: true, sessionId };
}
```

**IMPORTANT:** Server Actions cannot directly write to `localStorage` — that's browser-only. The pattern is: Server Action returns `sessionId`, Client Component receives it via `useActionState`, then calls `localStorage.setItem()` in a `useEffect` before redirecting.

### Pattern 5: Registration Form Component (Client)

```typescript
// src/components/RegistrationForm.tsx
'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions';

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState(registerUser, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      localStorage.setItem('sessionId', state.sessionId);
      router.push('/tutorial/1');
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      {/* fields */}
    </form>
  );
}
```

### Pattern 6: Client-Side Route Guard (AUTH-03)

**What:** Middleware CANNOT read `localStorage`. Route protection must happen client-side.

**The only viable pattern** without switching to cookies: a client component in the tutorial layout that checks `localStorage` on mount.

```typescript
// src/components/SessionGuard.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.replace('/');  // redirect to landing
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null; // or a loading skeleton
  return <>{children}</>;
}
```

Place `SessionGuard` in `src/app/tutorial/layout.tsx` wrapping `{children}`.

**Caveat:** This shows a blank flash before redirect. This is acceptable for v1 (it's a free tutorial, not a security boundary). The user briefly sees nothing, then redirects. Add `loading.tsx` with a spinner to improve UX.

### Pattern 7: Tailwind v4 CSS Setup

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Custom CSS variables go here in v4 */
@theme {
  --color-brand: #0066cc;
}
```

```javascript
// postcss.config.mjs (if not auto-generated by create-next-app)
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

No `tailwind.config.js` is needed for v4.

### Anti-Patterns to Avoid

- **Reading `localStorage` during render (outside `useEffect`):** Causes "ReferenceError: localStorage is not defined" on the server and hydration mismatches. Always read in `useEffect`.
- **Using Next.js middleware to check `localStorage`:** Middleware runs on the server/Edge — `localStorage` is invisible. The session check must be client-side.
- **Storing sensitive data in `localStorage`:** The session ID is a UUID pointer to a DB record — not a JWT, not credentials. This is fine.
- **Using `req.cookies` or `httpOnly` cookies for this session model:** The spec says localStorage, not cookies. Don't mix approaches.
- **`drizzle-kit push` in production:** Use `push` locally (quick iteration), but generate migration files with `generate` and apply with `migrate` for production/Vercel deploys.
- **Importing `db` in Client Components:** `db` uses the Neon driver which requires server environment. Only use it in Server Actions, Route Handlers, and Server Components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UUID generation | Custom random string function | `crypto.randomUUID()` (built-in) | Cryptographically secure, zero deps, available in Node.js |
| Form validation | Custom `if/else` checks | Zod `safeParse` | Type narrowing + structured error objects in one call |
| DB schema type safety | Raw SQL strings | Drizzle schema + inferred types | Catches column name typos at compile time |
| URL normalization | Custom regex replace | Zod `.transform()` + `.url()` | Composable, testable, handles edge cases |

**Key insight:** The "registration without OAuth" pattern is simpler than it looks — the hard parts (UUID generation, SQL, validation) all have zero-config built-in or library solutions. The only genuinely tricky part is the hydration-safe `localStorage` pattern, which requires the `useEffect` discipline described above.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from localStorage Read

**What goes wrong:** Component reads `localStorage.getItem('sessionId')` directly in the component body (outside `useEffect`). During SSR, `localStorage` is undefined → server renders "not registered" state. Client renders "registered" state. React throws hydration error.

**Why it happens:** `localStorage` is a browser-only API. Even `'use client'` components are pre-rendered on the server for the initial HTML.

**How to avoid:** Always read `localStorage` inside `useEffect` with an empty dependency array. Initialize state to `null` (or a "loading" sentinel) and only update after the effect runs.

**Warning signs:** `Error: Hydration failed because the initial UI does not match what was rendered on the server.`

---

### Pitfall 2: Middleware Cannot Protect localStorage-Based Sessions

**What goes wrong:** Developer writes `middleware.ts` that tries to `request.headers.get('x-session-id')` or reads a cookie that doesn't exist — redirects all `/tutorial/*` requests to `/` even for registered users.

**Why it happens:** `localStorage` is client-only. Middleware runs on the server/Edge before any JS executes in the browser. There is no cookie, no header — the session is invisible to the server.

**How to avoid:** Use the `SessionGuard` client component pattern (see Pattern 6). Do NOT add a `matcher` for `/tutorial/*` in `middleware.ts` for this session model. If server-side protection is needed in a future phase, migrate to `httpOnly` cookies.

**Warning signs:** All `/tutorial/*` requests redirect even when user is registered.

---

### Pitfall 3: `crypto.randomUUID()` Not Available in Edge Runtime

**What goes wrong:** Developer puts the `registerUser` Server Action in a file marked with `export const runtime = 'edge'`. `crypto.randomUUID()` throws because the Edge Runtime has a different crypto API.

**Why it happens:** Edge Runtime uses the Web Crypto API (`crypto.subtle`), but `crypto.randomUUID()` is also available there in modern runtimes. However, the Neon HTTP driver also requires Node.js environment for some features.

**How to avoid:** Do NOT use Edge Runtime for Server Actions that touch the database. Use the default Node.js runtime. Verify by NOT adding `export const runtime = 'edge'` to any route or action file in this phase.

**Warning signs:** Cryptic errors about missing APIs in Server Actions.

---

### Pitfall 4: `email` Field Assumed Non-Null

**What goes wrong:** Email is optional in the form (AUTH-01). If the Drizzle schema or server action treats `email` as `NOT NULL`, the DB insert fails for users who skip the email field.

**Why it happens:** Default Drizzle behavior for `text()` columns is NOT NULL. You must explicitly call `.nullable()` or accept `null` in the schema.

**How to avoid:** Define `email: text('email')` (nullable by default in Drizzle when no `.notNull()` is chained). In the Server Action, use `email: parsed.data.email ?? null`.

**Warning signs:** `null value in column "email" of relation "users" violates not-null constraint`

---

### Pitfall 5: LinkedIn URL Validation Too Strict or Too Loose

**What goes wrong:**
- Too strict: rejects valid URLs like `linkedin.com/in/username` (without https://) or mobile variants
- Too loose: accepts `https://linkedin.com/company/foo` (company page, not personal profile)

**How to avoid:** Use the regex in the Code Examples section. Normalize the URL (add `https://` if missing) after validation, before storing.

**Warning signs:** Users report "invalid URL" errors on valid profiles, or company page URLs are accepted.

---

### Pitfall 6: `drizzle-kit push` Silently Drops Columns

**What goes wrong:** Running `drizzle-kit push` on a schema that removes a column drops that column in the DB without a migration file. Data is lost.

**Why it happens:** `push` is a "sync schema" operation — it makes the DB match the schema, including destructive changes.

**How to avoid:** For initial development (no data to lose), `push` is fine. Once any real user data exists, switch to `generate` + `migrate`. Document this transition point.

**Warning signs:** No warning — columns silently disappear.

---

### Pitfall 7: Blank Flash Before SessionGuard Redirect

**What goes wrong:** `/tutorial/1` briefly renders blank (or the page content) before `useEffect` fires and redirects unauthenticated users. This is visible.

**Why it happens:** `useEffect` runs after the first paint. The component renders once with `checked = false` (returns `null`), then the effect fires.

**How to avoid:** Return a loading skeleton or spinner from `SessionGuard` while `checked === false`. Use `loading.tsx` in the `tutorial/` route segment for a fallback.

**Warning signs:** Flash of blank page on `/tutorial/1` when not registered.

---

## Code Examples

Verified patterns from official sources:

### Zod Schema for Registration

```typescript
// src/lib/validations.ts
import { z } from 'zod';

const LINKEDIN_PROFILE_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_.]{3,100})\/?$/;

export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  linkedinUrl: z
    .string()
    .min(1, 'LinkedIn profile URL is required')
    .regex(LINKEDIN_PROFILE_REGEX, 'Must be a valid linkedin.com/in/... URL')
    .transform((url) => {
      // Normalize: add https:// if missing
      if (!url.startsWith('http')) return `https://${url}`;
      return url;
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')).transform(v => v || undefined),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
```

**LinkedIn URL validation notes (MEDIUM confidence — community-verified):**
- Valid: `linkedin.com/in/john-doe`, `https://www.linkedin.com/in/john.doe`, `https://linkedin.com/in/user_123`
- Invalid: `linkedin.com/company/foo`, `linkedin.com/in/`, `twitter.com/in/user`
- Username rules: 3-100 chars, alphanumeric + hyphens + underscores + periods
- Mobile variants (`/mwlite/in/`) are rare — acceptable to exclude for v1

### Drizzle Migration Commands

```bash
# Development — push schema directly (fast, no migration files)
npx drizzle-kit push

# Production — generate SQL migration file, then apply
npx drizzle-kit generate
npx drizzle-kit migrate

# Inspect current schema in DB
npx drizzle-kit studio
```

### Environment Variables

```bash
# .env.local (gitignored)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Vercel: add via dashboard or CLI
vercel env add DATABASE_URL
```

### Next.js 15 App Init Command

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

The `.` installs into the current directory (project root). Confirm prompts:
- Would you like to use TypeScript? **Yes**
- Would you like to use ESLint? **Yes**
- Would you like to use Tailwind CSS? **Yes**
- Would you like your code inside a `src/` directory? **Yes**
- Would you like to use App Router? **Yes**
- Would you like to use Turbopack? **Yes** (faster dev server)
- Customize import alias? **@/*** (default)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` (React DOM) | `useActionState` (React core) | React 19 / Next.js 15 | Import from `react`, not `react-dom` |
| `tailwind.config.js` | No config file; CSS `@import "tailwindcss"` | Tailwind v4 (2025) | Less config, faster builds |
| `tailwindcss` PostCSS plugin | `@tailwindcss/postcss` separate package | Tailwind v4 | Must install separately if not using `create-next-app` |
| `pages/` router | `app/` router with Server Components | Next.js 13+ | Server Actions, layouts, streaming |
| `@vercel/postgres` | `@neondatabase/serverless` | Vercel Postgres deprecated | Neon is the underlying provider; use directly |
| `next/server` Response.redirect | `NextResponse.redirect` | Next.js 13+ | Same API, different import |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: replaced by `useActionState` from `react` in React 19. Next.js 15 uses React 19.
- Auth.js v5 for this project: explicitly out of scope. The REQUIREMENTS spec AUTH-01 says "Sin OAuth, sin login."
- LinkedIn OAuth flow: out of scope for this project per current REQUIREMENTS.md.

---

## Open Questions

1. **Session expiry policy**
   - What we know: Session UUID in localStorage persists until manually cleared or browser storage is wiped
   - What's unclear: Should sessions ever expire? REQUIREMENTS.md mentions "la sesión expira en 30 días" as a v2 deferred item
   - Recommendation: For v1, no expiry. Store `createdAt` in DB for future expiry logic. Do not implement expiry in Phase 1.

2. **UUID vs sequential ID for users table primary key**
   - What we know: `defaultRandom()` in Drizzle → `gen_random_uuid()` in Postgres — fine for Neon
   - What's unclear: Whether any future requirement needs sequential IDs for ordering
   - Recommendation: Use UUID. It's better for distributed systems and avoids enumeration attacks on `/certificate/[userId]` in Phase 4.

3. **Duplicate registration handling**
   - What we know: A user could submit the form twice (e.g., if they clear localStorage)
   - What's unclear: Should the system return the existing session or create a new record?
   - Recommendation: For v1, create a new record (simpler). The `linkedin_url` is not enforced as UNIQUE in Phase 1 because different people can share an account URL (unlikely but possible). Add UNIQUE constraint if analytics show duplicates are a problem.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js, npm scripts | Yes | v25.8.0 | — |
| npm | Package management | Yes | 11.11.0 | — |
| npx | create-next-app | Yes | 11.11.0 | — |
| Neon Postgres | Database | Manual setup required | — | Cannot proceed without — creator must create Neon project and provide DATABASE_URL |
| Vercel CLI | Optional deployment | Not checked | — | Deploy via GitHub integration instead |

**Missing dependencies with no fallback:**
- **Neon DATABASE_URL**: The planner must include a Wave 0 step: "Create Neon project at neon.tech, copy connection string to `.env.local`". This is a 2-minute manual step that cannot be automated.

**Missing dependencies with fallback:**
- None for core functionality.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest + React Testing Library (standard for Next.js) OR Vitest (faster) |
| Config file | None exists — Wave 0 must create it |
| Quick run command | `npm test -- --testPathPattern=unit` |
| Full suite command | `npm test` |

**Recommendation:** Use Vitest for this project — faster, better ESM support, no Babel config needed. Install: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom`.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Zod schema validates name+linkedinUrl required, email optional | unit | `npx vitest run src/lib/validations.test.ts` | No — Wave 0 |
| AUTH-01 | LinkedIn URL regex accepts valid formats, rejects company/invalid | unit | `npx vitest run src/lib/validations.test.ts` | No — Wave 0 |
| AUTH-01 | Server Action returns `{ success: false, errors }` on invalid input | unit | `npx vitest run src/app/actions.test.ts` | No — Wave 0 |
| AUTH-01 | Server Action inserts user and returns sessionId on valid input | integration | `npx vitest run src/app/actions.test.ts` | No — Wave 0 |
| AUTH-02 | RegistrationForm stores sessionId in localStorage after success | unit (jsdom) | `npx vitest run src/components/RegistrationForm.test.tsx` | No — Wave 0 |
| AUTH-03 | SessionGuard redirects to `/` when no sessionId in localStorage | unit (jsdom) | `npx vitest run src/components/SessionGuard.test.tsx` | No — Wave 0 |
| AUTH-03 | SessionGuard renders children when sessionId exists | unit (jsdom) | `npx vitest run src/components/SessionGuard.test.tsx` | No — Wave 0 |

**Manual-only tests (no automation):**
- E2E: Fill form in browser → confirm redirect to `/tutorial/1` → close browser → reopen → confirm still on `/tutorial/1`
- E2E: Navigate to `/tutorial/1` without registering → confirm redirect to `/`
- DB verification: `SELECT * FROM users` in Neon console shows the registered user

### Sampling Rate

- **Per task commit:** `npx vitest run src/lib/validations.test.ts` (validation logic only, <5s)
- **Per wave merge:** `npx vitest run` (all unit tests)
- **Phase gate:** Full suite green before marking Phase 1 complete

### Wave 0 Gaps

- [ ] `vitest.config.ts` — framework config
- [ ] `src/lib/validations.test.ts` — AUTH-01 validation rules
- [ ] `src/app/actions.test.ts` — AUTH-01 server action behavior
- [ ] `src/components/RegistrationForm.test.tsx` — AUTH-02 localStorage write
- [ ] `src/components/SessionGuard.test.tsx` — AUTH-03 redirect logic
- [ ] `vitest` install: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom`

---

## Sources

### Primary (HIGH confidence)

- [Drizzle ORM — Get Started with Neon](https://orm.drizzle.team/docs/get-started/neon-new) — connection setup, schema definition, migration commands
- [Tailwind CSS — Install with Next.js](https://tailwindcss.com/docs/guides/nextjs) — v4 PostCSS config, globals.css import
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — hydration, use client directive
- npm registry (`npm view [pkg] version`) — all package versions verified 2026-04-02

### Secondary (MEDIUM confidence)

- [Neon Docs — Drizzle Migrations](https://neon.com/docs/guides/drizzle-migrations) — push vs migrate workflow
- [GitHub Discussion — Next.js Middleware + localStorage](https://github.com/vercel/next.js/discussions/52463) — confirms middleware cannot read localStorage
- [Sentry — localStorage not defined in Next.js](https://sentry.io/answers/referenceerror-localstorage-is-not-defined-in-next-js/) — hydration fix pattern
- [Next.js — useActionState pattern](https://github.com/vercel/next.js/discussions/86447) — React 19 useActionState with Zod
- LinkedIn profile URL regex — community-verified regex patterns from regex101.com library

### Tertiary (LOW confidence)

- LinkedIn username character rules (3-100 chars, alphanumeric + `-_.`) — sourced from community articles; LinkedIn does not publish an official regex spec. Flag for validation if edge cases appear.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified from npm registry
- Architecture: HIGH — patterns from official Next.js and Drizzle docs
- localStorage session model: HIGH — well-documented limitation of middleware + useEffect pattern
- LinkedIn URL regex: MEDIUM — community-verified, no official LinkedIn spec
- Pitfalls: HIGH — most pitfalls are documented in official sources or are observable from first principles

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable stack — Next.js, Drizzle, Tailwind are all in stable release cycles)
