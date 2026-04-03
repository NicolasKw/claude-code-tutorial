# Phase 2: Tutorial Shell + Progress Engine - Research

**Researched:** 2026-04-02
**Domain:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui New York, Drizzle ORM (Supabase/Postgres), localStorage progress engine
**Confidence:** HIGH

---

## Summary

Phase 2 builds the tutorial shell — the structural wrapper around 7 tutorial levels — without authoring content (that is Phase 3). The core engineering work is: (1) a progress engine that persists to localStorage AND Supabase, (2) a locked/unlocked level gate enforced on the client, (3) step-by-step completion flow with self-attestation buttons, (4) an achievement overlay triggered at level completion, (5) a sticky progress header, and (6) a code block component with 1-click copy.

The UI-SPEC is locked and approved. Design tokens, component choices (shadcn Button/Card/Progress/Badge), copy strings, layout dimensions, and animation timings are all decided. Research validates implementation patterns for each, identifies the correct APIs in Next.js 16 and Tailwind v4, and documents pitfalls executors must avoid.

The key architecture decision to resolve is progress persistence: the locked decision says `localStorage` with key `tutorial_progress`, but TUTO-04 requires persistence "linked to their LinkedIn user ID" in the database so progress survives across browsers/devices. The correct implementation is a **dual-write strategy**: write to localStorage immediately for instant UI response, and fire a server action in the background to persist to Supabase. This avoids the latency of round-tripping to the DB on every step click.

**Primary recommendation:** Build a `useProgress` client hook that owns localStorage reads/writes and calls a `saveProgress` server action for DB sync. The progress table uses a `jsonb` column (Drizzle's `jsonb()`) to store the full progress blob, keyed by `user_id`.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TUTO-01 | Tutorial has exactly 7 linearly unlockable levels. No level skipping. | Progress hook gates access; locked-level UI renders when `currentLevel < requestedLevel`. |
| TUTO-02 | Completing a level unlocks the next with visible feedback (animation or clear state change). | Achievement overlay component, fade-in 200ms; state mutation triggers re-render of header progress bar (300ms ease). |
| TUTO-03 | Each level has multiple steps. User advances step-by-step via "Listo, ya lo hice" button (self-attestation, no auto-verification). | Step completion state in progress hook; next step fade-in (150ms); final step triggers achievement overlay. |
| TUTO-04 | Progress (levels + steps) saved to DB linked to user's LinkedIn user ID. Resumes on return. | Dual-write: localStorage for instant response + `saveProgress` server action to Supabase `progress` table (jsonb). |
| TUTO-05 | Commands and code blocks in monospace with 1-click copy. Visual distinction from prose. | `CodeBlock` client component; `navigator.clipboard.writeText()`; lucide Copy/Check icon swap; Geist Mono font. |
| TUTO-06 | Macro progress indicator "Nivel X de 7" visible on all tutorial pages without scrolling. | Sticky header (`sticky top-0 z-50`) with shadcn Badge + Progress bar; rendered in tutorial layout. |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

**CRITICAL — enforced by AGENTS.md:**

> "This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices."

**Directive for every executor:** Before writing any Next.js-touching code, read the relevant file in `node_modules/next/dist/docs/01-app/`. Relevant files for Phase 2:
- `01-getting-started/05-server-and-client-components.md`
- `01-getting-started/07-mutating-data.md`
- `03-api-reference/03-file-conventions/layout.md`
- `03-api-reference/03-file-conventions/dynamic-routes.md`
- `03-api-reference/04-functions/use-router.md`
- `03-api-reference/04-functions/redirect.md`

This is not optional. It is a project-level requirement with the same authority as locked decisions.

---

## Standard Stack

### Core (all already installed)

| Library | Installed Version | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| next | 16.2.2 | App Router, routing, server actions | Project foundation |
| react | 19.2.4 | UI components, hooks, transitions | Project foundation |
| tailwindcss | 4.2.2 | CSS utilities (CSS-first, no config file) | Project foundation |
| drizzle-orm | 0.45.2 | ORM for Supabase/Postgres | Phase 1 established |
| zod | 4.3.6 | Runtime validation | Phase 1 established |

### To Install in Phase 2 (shadcn and dependencies)

| Library | Latest Version | Purpose | Install Via |
|---------|----------------|---------|-------------|
| shadcn/ui | 4.1.2 (CLI) | Component scaffolding (Button, Card, Progress, Badge) | `npx shadcn@latest init` then `add` commands |
| lucide-react | 1.7.0 | Icon set (Copy, Check, Lock, ChevronRight) | Installed by shadcn automatically |
| class-variance-authority | 0.7.1 | shadcn variant system | Installed by shadcn automatically |
| clsx | 2.1.1 | Class merging | Installed by shadcn automatically |
| tailwind-merge | 3.5.0 | Tailwind class deduplication | Installed by shadcn automatically |
| @radix-ui/react-progress | 1.1.8 | Accessible progress bar (via shadcn) | Installed by `npx shadcn@latest add progress` |
| @radix-ui/react-slot | 1.2.4 | shadcn Button asChild pattern | Installed by shadcn automatically |

**Installation sequence (order matters):**
```bash
# Step 1: Init shadcn (creates components.json, installs all peer deps)
npx shadcn@latest init
# When prompted: select New York style, confirm Tailwind v4 detection

# Step 2: Add required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add badge
```

**Version verification (run before writing the plan):**
```bash
npm view shadcn version          # 4.1.2
npm view lucide-react version    # 1.7.0
npm view @radix-ui/react-progress version  # 1.1.8
```

### Alternatives Considered

| Standard Choice | Alternative | Why Standard Wins |
|-----------------|-------------|-------------------|
| localStorage dual-write | DB-only (server action per click) | localStorage is instant; DB call has 50-200ms latency that would make steps feel sluggish |
| localStorage dual-write | localStorage-only | TUTO-04 explicitly requires DB persistence linked to user ID |
| jsonb column for progress | normalized rows (one row per level/step) | jsonb is simpler schema, progress shape is small and always read whole |
| shadcn Progress | custom CSS progress bar | shadcn handles aria-valuenow, aria-valuemin/max automatically |
| `navigator.clipboard.writeText()` | execCommand('copy') | execCommand is deprecated; Clipboard API is the standard |

---

## Architecture Patterns

### Recommended File Structure

```
src/
├── app/
│   └── tutorial/
│       ├── layout.tsx              # Existing: SessionGuard wrapper (keep)
│       │                           # Phase 2 adds: TutorialShell (sticky header)
│       └── [level]/
│           └── page.tsx            # Replace stub with real locked/unlocked gate
├── components/
│   ├── tutorial/
│   │   ├── TutorialShell.tsx       # 'use client' — sticky header + progress bar
│   │   ├── LevelPage.tsx           # 'use client' — level gate + step list + achievement overlay
│   │   ├── StepCard.tsx            # 'use client' — single step with "Listo" button
│   │   ├── AchievementOverlay.tsx  # 'use client' — full-screen modal on level complete
│   │   ├── CodeBlock.tsx           # 'use client' — monospace + copy button
│   │   └── LockedLevel.tsx         # pure presentational — lock icon + "Este nivel está bloqueado"
│   └── ui/                         # shadcn generated components (do not edit manually)
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       └── badge.tsx
├── hooks/
│   └── useProgress.ts              # 'use client' custom hook — all progress state
├── lib/
│   ├── progress.ts                 # Pure functions: isLevelLocked, completeStep, completeLevel
│   └── session.ts                  # Existing — getSessionId, setSessionId
├── db/
│   └── schema.ts                   # Extend with `progress` table
└── app/
    └── actions/
        └── progress.ts             # 'use server' — saveProgress server action
```

### Pattern 1: useProgress Custom Hook (central pattern)

**What:** A `'use client'` hook that reads/writes `tutorial_progress` from localStorage and calls a server action for DB sync.

**When to use:** Every component that needs progress state imports this hook. It is the single source of truth.

**Shape enforced by hook:**
```typescript
// Source: locked decision in 02-UI-SPEC.md
interface TutorialProgress {
  currentLevel: number;          // 0-7, the level user is currently on
  completedLevels: number[];     // e.g. [0, 1, 2]
  completedSteps: Record<number, number[]>; // e.g. { 0: [0,1,2], 1: [0] }
}

const PROGRESS_KEY = 'tutorial_progress';
const TOTAL_LEVELS = 7;

// Hook signature
function useProgress(): {
  progress: TutorialProgress;
  completeStep: (level: number, step: number) => void;
  completeLevel: (level: number) => void;
  isLevelLocked: (level: number) => boolean;
  isStepCompleted: (level: number, step: number) => boolean;
}
```

**Key behavior:**
- Initialize from localStorage on mount (with SSR guard: `typeof window !== 'undefined'`)
- Default state: `{ currentLevel: 0, completedLevels: [], completedSteps: {} }`
- On `completeStep`: update localStorage immediately, then fire server action (fire-and-forget)
- On `completeLevel`: mark level complete, advance `currentLevel`, update localStorage, fire server action

**Example implementation skeleton:**
```typescript
// Source: Next.js docs + localStorage pattern established in Phase 1
'use client';
import { useState, useEffect, useCallback } from 'react';
import { saveProgress } from '@/app/actions/progress';

export function useProgress() {
  const [progress, setProgress] = useState<TutorialProgress>({
    currentLevel: 0,
    completedLevels: [],
    completedSteps: {},
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      try {
        setProgress(JSON.parse(raw));
      } catch {
        // corrupt data — reset to default
      }
    }
  }, []);

  const persist = useCallback((next: TutorialProgress) => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    setProgress(next);
    // Fire-and-forget DB sync — errors are non-blocking
    saveProgress(next).catch(() => {});
  }, []);

  const completeStep = useCallback((level: number, step: number) => {
    setProgress(prev => {
      const completedSteps = {
        ...prev.completedSteps,
        [level]: [...new Set([...(prev.completedSteps[level] ?? []), step])],
      };
      const next = { ...prev, completedSteps };
      persist(next);
      return next;
    });
  }, [persist]);

  // ... completeLevel, isLevelLocked etc.
}
```

### Pattern 2: Server Component Page + Client Component Subtree

**What:** `[level]/page.tsx` remains a Server Component (async function, reads params via `await params`). It passes the level number as a prop to `<LevelPage>`, which is a Client Component.

**Why:** The page.tsx must be async to `await params` per Next.js 16 docs. The actual interactivity lives in Client Components below.

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md
// app/tutorial/[level]/page.tsx — Server Component
interface TutorialLevelPageProps {
  params: Promise<{ level: string }>;
}

export default async function TutorialLevelPage({ params }: TutorialLevelPageProps) {
  const { level } = await params;
  const levelNum = parseInt(level, 10);

  // Validate range
  if (isNaN(levelNum) || levelNum < 0 || levelNum > 7) {
    // notFound() from next/navigation
  }

  return <LevelPage level={levelNum} />;
}
```

**CRITICAL:** In Next.js 16, `params` is a Promise. Always `await params` before accessing properties. This is verified in `node_modules/next/dist/docs/`.

### Pattern 3: saveProgress Server Action

**What:** A server action that upserts the progress blob into the `progress` table using the session ID to look up the user.

```typescript
// Source: Next.js docs — node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md
// app/actions/progress.ts
'use server';

import { db } from '@/db';
import { progress } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function saveProgress(data: TutorialProgress): Promise<void> {
  // Note: sessionId must be passed from client (cannot read localStorage on server)
  // Pattern: client passes sessionId alongside progress data
}
```

**IMPORTANT:** Server actions cannot access `localStorage`. The client must send `sessionId` as part of the call. The server action looks up the user by `sessionId`, then upserts progress.

### Pattern 4: Achievement Overlay — Dialog Pattern

**What:** `AchievementOverlay` is a controlled component shown when a level is completed. Uses `role="dialog"` with focus trap.

**Dismiss behavior:** CTA click only (no click-outside-to-dismiss, per UI-SPEC). CTA calls `router.push('/tutorial/{level + 1}')` then closes overlay.

**Focus trap:** Phase 2 implements a manual focus trap (first/last focusable element loop) OR waits for Phase 4's dialog needs to add Radix Dialog. For Phase 2, a simple `useEffect` that focuses the CTA button on mount is sufficient since the overlay has one interactive element.

### Anti-Patterns to Avoid

- **Using `params.level` directly without await:** In Next.js 16, `params` is a Promise. Accessing `params.level` without `await params` returns `undefined`. Verified in Next.js 16 docs.
- **Calling `localStorage` in Server Components:** localStorage is browser-only. All progress reads must be in Client Components with an `if (typeof window === 'undefined') return` SSR guard.
- **Storing progress in React state only:** Progress state initialized on mount from localStorage; without the SSR guard, the component will hydration-mismatch.
- **Using `tailwind.config.js` for brand colors:** Tailwind v4 is CSS-first. Brand tokens go in `globals.css` inside the `:root` block. The `@theme inline` block maps CSS vars to Tailwind utility classes. Adding a `tailwind.config.js` breaks the v4 setup.
- **Editing shadcn-generated files in `src/components/ui/`:** These are scaffolded by the CLI. Brand color overrides go in `globals.css` as CSS custom properties, not directly in the components.
- **Calling `router.push()` from Server Components:** `useRouter` is a Client Component hook only. Server Components use `redirect()` from `next/navigation`.
- **Running `npx shadcn@latest init` without reading the prompts:** shadcn init will ask about style (New York), base color, and CSS variables. Select New York; confirm Tailwind v4 auto-detection; use CSS variables (yes).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Progress bar with aria | Custom `<div>` with width style | shadcn `<Progress>` (Radix UI) | aria-valuenow, aria-valuemin, aria-valuemax handled automatically |
| Badge "Nivel X de 7" | Styled `<span>` | shadcn `<Badge>` | Consistent variant system; no custom CSS to maintain |
| Copy-to-clipboard | Manual DOM selection + execCommand | `navigator.clipboard.writeText()` | execCommand is deprecated in all major browsers |
| Modal backdrop | Custom `fixed inset-0` div with custom click handling | Radix Dialog (via shadcn) OR manual with `role="dialog"` | Radix handles focus trap, Escape key, scroll lock. If Phase 2 doesn't add shadcn Dialog, at minimum use `role="dialog" aria-modal="true"` with manual focus-on-mount |
| Icon set | SVG components | lucide-react (already bundled with shadcn) | `Lock`, `Copy`, `Check` icons available; no extra install needed |
| Class merging | String concatenation | `cn()` utility from shadcn (`clsx` + `tailwind-merge`) | Prevents Tailwind class conflicts; auto-installed by shadcn |

**Key insight:** The shadcn CLI generates source code you own. It is not a dependency to import — it scaffolds files into `src/components/ui/`. Run the add commands, then use the components like any local module.

---

## Progress Persistence: localStorage vs DB — Decision Record

**Requirement:** TUTO-04 says "progress saved in the database linked to their LinkedIn user ID." The UI-SPEC says "localStorage key `tutorial_progress`."

**These are not in conflict.** Use both:

| Layer | Key | What it does |
|-------|-----|--------------|
| localStorage | `tutorial_progress` | Immediate read/write; instant UI response; survives page refreshes |
| Supabase `progress` table | user_id → jsonb blob | Cross-device persistence; survives localStorage clear; enables creator to query progress |

**DB schema to add:**

```typescript
// Source: drizzle-orm/pg-core — jsonb column type verified in installed package
import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  data: jsonb('data').notNull().$type<TutorialProgress>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Migration:** Use `npx drizzle-kit push` (dev) or generate a migration with `npx drizzle-kit generate` then `npx drizzle-kit migrate`.

**Server action upsert pattern:**

```typescript
// Drizzle upsert via onConflictDoUpdate
await db.insert(progress)
  .values({ userId, data: progressData, updatedAt: new Date() })
  .onConflictDoUpdate({
    target: progress.userId,
    set: { data: progressData, updatedAt: new Date() },
  });
```

This requires a unique constraint on `userId` in the progress table — add `.unique()` to the `userId` column definition.

**On page load / resume:** Client component reads from localStorage first (immediate), then optionally fires a fetch to load DB state (for cross-device). For Phase 2, it is acceptable to use localStorage as primary source and DB as write-through only. Full cross-device sync (DB read on load) can be a Phase 2.1 enhancement if the creator requests it.

---

## Tailwind v4 Specifics

Tailwind v4 (installed: 4.2.2) uses a CSS-first configuration approach. There is **no `tailwind.config.js`**. The project already has the correct pattern in `globals.css`:

```css
/* Source: existing src/app/globals.css — confirmed pattern */
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**To add brand tokens** (as specified in UI-SPEC):

```css
/* Add to :root block */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --brand-primary: #D9ADFF;
  --brand-secondary: #70B5FF;
  --brand-success: #E9FFB9;
}

/* Add to @theme inline block to expose as Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-primary: var(--brand-primary);
  --color-brand-secondary: var(--brand-secondary);
  --color-brand-success: var(--brand-success);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

This exposes `bg-brand-primary`, `text-brand-primary`, `border-brand-secondary`, etc. as Tailwind utility classes.

**IMPORTANT:** Do NOT add Tailwind v3-style `theme.extend.colors` in a JS config. That file does not exist in this project and must not be created.

---

## shadcn New York Style + Tailwind v4 Integration

shadcn's `npx shadcn@latest init` (version 4.1.2) auto-detects Tailwind v4 when it finds `@import "tailwindcss"` in globals.css. The CLI will:
1. Create `components.json` with `{ "style": "new-york", "tailwind": { "config": "" } }` (empty config path = v4 CSS-first mode)
2. Add `@layer base { ... }` CSS into `globals.css` with shadcn CSS variable definitions (--radius, --card, etc.)
3. NOT create a `tailwind.config.js`

**Conflict risk:** shadcn will add its own CSS variable block to `globals.css`. The brand token additions from UI-SPEC must be added to the `:root` block AFTER shadcn init, being careful not to duplicate or conflict with shadcn's variables. shadcn uses `--primary`, `--secondary` etc. — these are different from `--brand-primary`, `--brand-secondary` (project uses the `--brand-` prefix specifically to avoid conflict).

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from localStorage Read

**What goes wrong:** Component initializes progress state from `localStorage` synchronously on first render. Server renders default state; client immediately renders different state (from localStorage). React throws hydration mismatch.

**Why it happens:** `useEffect` runs only on the client. Accessing `localStorage` outside `useEffect` causes the server-rendered HTML to differ from the first client render.

**How to avoid:** Always initialize to the default (empty) state, then update via `useEffect`:
```typescript
const [progress, setProgress] = useState<TutorialProgress>(DEFAULT_PROGRESS);
useEffect(() => {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (raw) setProgress(JSON.parse(raw));
}, []);
```

**Warning signs:** React error "Hydration failed because the server rendered HTML didn't match the client."

### Pitfall 2: Treating `params` as Synchronous Object

**What goes wrong:** Executor writes `const level = params.level` instead of `const { level } = await params`. In Next.js 16, this returns a Promise object, not the string.

**Why it happens:** Training data / older examples show `params.slug` as synchronous.

**How to avoid:** Always write `const { level } = await params` in async Server Components. In Client Components, use `React.use(params)` from React 19.

**Warning signs:** `parseInt(params.level)` returns `NaN`; level page renders "Nivel NaN".

### Pitfall 3: Adding `tailwind.config.js`

**What goes wrong:** Executor adds a `tailwind.config.js` to extend theme. This puts Tailwind into v3 compatibility mode and breaks the CSS-first setup.

**Why it happens:** Tailwind v3 muscle memory.

**How to avoid:** All customizations go in `globals.css` inside `@theme inline`. Never create `tailwind.config.js` or `tailwind.config.ts` in this project.

**Warning signs:** Tailwind utility classes stop working; PostCSS build errors.

### Pitfall 4: Server Action Cannot Read localStorage

**What goes wrong:** Executor tries to call `getSessionId()` inside the server action to identify the user.

**Why it happens:** `session.ts` has a `typeof window === 'undefined'` guard, so it silently returns null on the server.

**How to avoid:** The client component passes `sessionId` explicitly as an argument to the server action alongside the progress data.

### Pitfall 5: Shadcn Component Customization in `src/components/ui/`

**What goes wrong:** Executor edits `src/components/ui/progress.tsx` to hardcode `#D9ADFF` as the fill color.

**Why it happens:** The component is local code — it looks editable.

**How to avoid:** Override colors via CSS custom properties in `globals.css` or via `className` props. The UI-spec progress bar fill is achieved by overriding shadcn's `--primary` CSS variable, or by passing `className` with the Tailwind color utility.

### Pitfall 6: Missing `generateStaticParams` for Tutorial Levels

**What goes wrong:** Levels 0-7 are not pre-rendered, causing a flash/loading state on first navigation.

**Why it happens:** Dynamic routes are server-rendered per-request by default.

**How to avoid:** Export `generateStaticParams` from `[level]/page.tsx` to pre-render all 8 level pages (0-7) at build time:
```typescript
export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({ level: String(i) }));
}
```

---

## Code Examples

### Sticky Progress Header

```tsx
// Source: UI-SPEC layout contract + Next.js client component pattern
'use client';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TutorialHeaderProps {
  currentLevel: number;
  totalLevels?: number;
}

export function TutorialHeader({ currentLevel, totalLevels = 7 }: TutorialHeaderProps) {
  const percent = (currentLevel / totalLevels) * 100;

  return (
    <header className="sticky top-0 z-50 h-14 bg-foreground flex flex-col justify-center">
      <div className="flex items-center justify-between px-4">
        <span className="text-sm font-semibold text-white">ZalesMachine</span>
        <Badge variant="secondary">Nivel {currentLevel} de {totalLevels}</Badge>
      </div>
      <Progress
        value={percent}
        className="h-2 rounded-none"
        aria-label="Progreso del tutorial"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </header>
  );
}
```

### CodeBlock Component with Copy Button

```tsx
// Source: UI-SPEC code block spec + Clipboard API (standard, not deprecated)
'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-lg bg-foreground p-4 font-mono text-sm leading-relaxed">
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Código copiado' : 'Copiar código'}
        className="absolute top-3 right-3 text-brand-primary hover:opacity-80"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="text-white overflow-x-auto">{code}</pre>
    </div>
  );
}
```

### Locked Level UI

```tsx
// Source: UI-SPEC locked level state section
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LockedLevelProps {
  requestedLevel: number;
  currentLevel: number;
}

export function LockedLevel({ requestedLevel, currentLevel }: LockedLevelProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Lock size={24} aria-hidden="true" className="mb-4 opacity-40" />
      <h2 className="text-xl font-semibold mb-2">Este nivel está bloqueado</h2>
      <p className="text-base text-foreground/60 mb-6">
        Completá el Nivel {currentLevel} para desbloquearlo.
      </p>
      <Button variant="outline" asChild>
        <Link href={`/tutorial/${currentLevel}`}>Volver al Nivel {currentLevel}</Link>
      </Button>
    </div>
  );
}
```

### DB Schema Addition

```typescript
// Source: drizzle-orm/pg-core — jsonb and uuid types verified in installed package
import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './schema'; // existing users table

interface TutorialProgress {
  currentLevel: number;
  completedLevels: number[];
  completedSteps: Record<number, number[]>;
}

export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id),
  data: jsonb('data').notNull().$type<TutorialProgress>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## Environment Availability

Step 2.6: Audited — no new external services required. Supabase is already configured (migrated in quick task 260402-o51). All npm packages are either already installed or installed via `npx shadcn@latest`.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Supabase (DATABASE_URL) | TUTO-04 progress persistence | ✓ | Configured in .env.local | — |
| npx / npm | shadcn init | ✓ | System npm | — |
| navigator.clipboard API | TUTO-05 copy button | ✓ | Browser API (jsdom for tests) | Mock in tests |
| drizzle-orm jsonb | Progress table | ✓ | 0.45.2 (jsonb column verified in package) | — |

**Missing dependencies with no fallback:** None.

---

## Validation Architecture

`nyquist_validation: true` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + Testing Library React 16.3.2 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |
| Test pattern | `src/**/*.test.{ts,tsx}` |
| Environment | jsdom + custom localStorage mock in `src/test-setup.ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File |
|--------|----------|-----------|-------------------|------|
| TUTO-01 | `isLevelLocked()` returns true when requestedLevel > currentLevel | unit | `npm test -- progress` | `src/lib/__tests__/progress.test.ts` ❌ Wave 0 |
| TUTO-01 | `<LevelPage>` renders `<LockedLevel>` when level is locked | unit | `npm test -- LevelPage` | `src/components/__tests__/LevelPage.test.tsx` ❌ Wave 0 |
| TUTO-01 | `<LevelPage>` renders content when level is unlocked | unit | `npm test -- LevelPage` | `src/components/__tests__/LevelPage.test.tsx` ❌ Wave 0 |
| TUTO-02 | `<AchievementOverlay>` renders when `show=true`, hidden when `show=false` | unit | `npm test -- AchievementOverlay` | `src/components/__tests__/AchievementOverlay.test.tsx` ❌ Wave 0 |
| TUTO-02 | Final-level overlay shows "Ver mi certificado" instead of "Ir al Nivel X+1" | unit | `npm test -- AchievementOverlay` | `src/components/__tests__/AchievementOverlay.test.tsx` ❌ Wave 0 |
| TUTO-03 | Clicking "Listo, ya lo hice" marks step complete and reveals next step | unit | `npm test -- StepCard` | `src/components/__tests__/StepCard.test.tsx` ❌ Wave 0 |
| TUTO-03 | Completed step button shows Check icon, becomes pointer-events-none | unit | `npm test -- StepCard` | `src/components/__tests__/StepCard.test.tsx` ❌ Wave 0 |
| TUTO-03 | Clicking "Listo, ya lo hice" on final step triggers `onLevelComplete` callback | unit | `npm test -- StepCard` | `src/components/__tests__/StepCard.test.tsx` ❌ Wave 0 |
| TUTO-04 | `useProgress` initializes from localStorage on mount | unit | `npm test -- useProgress` | `src/hooks/__tests__/useProgress.test.ts` ❌ Wave 0 |
| TUTO-04 | `completeStep` writes updated progress to localStorage | unit | `npm test -- useProgress` | `src/hooks/__tests__/useProgress.test.ts` ❌ Wave 0 |
| TUTO-04 | `completeLevel` advances `currentLevel` and adds to `completedLevels` | unit | `npm test -- useProgress` | `src/hooks/__tests__/useProgress.test.ts` ❌ Wave 0 |
| TUTO-04 | `saveProgress` server action calls DB upsert with correct userId | unit | `npm test -- progress.action` | `src/app/actions/__tests__/progress.test.ts` ❌ Wave 0 |
| TUTO-05 | `<CodeBlock>` renders code in `<pre>` with monospace font class | unit | `npm test -- CodeBlock` | `src/components/__tests__/CodeBlock.test.tsx` ❌ Wave 0 |
| TUTO-05 | Clicking copy button calls `navigator.clipboard.writeText` with code string | unit | `npm test -- CodeBlock` | `src/components/__tests__/CodeBlock.test.tsx` ❌ Wave 0 |
| TUTO-05 | Copy button shows Check icon for 2s after click then reverts | unit | `npm test -- CodeBlock` | `src/components/__tests__/CodeBlock.test.tsx` ❌ Wave 0 |
| TUTO-06 | `<TutorialHeader>` renders "Nivel X de 7" badge with correct level number | unit | `npm test -- TutorialHeader` | `src/components/__tests__/TutorialHeader.test.tsx` ❌ Wave 0 |
| TUTO-06 | `<TutorialHeader>` progress bar `aria-valuenow` equals `(level/7)*100` | unit | `npm test -- TutorialHeader` | `src/components/__tests__/TutorialHeader.test.tsx` ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test` (full suite, fast — all unit tests, < 10s)
- **Per wave merge:** `npm test` (same)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps (test files to create before implementation)

- [ ] `src/lib/__tests__/progress.test.ts` — covers TUTO-01 pure logic (`isLevelLocked`, `completeLevel`)
- [ ] `src/hooks/__tests__/useProgress.test.ts` — covers TUTO-03, TUTO-04 hook behavior (uses `renderHook` from Testing Library)
- [ ] `src/components/__tests__/TutorialHeader.test.tsx` — covers TUTO-06
- [ ] `src/components/__tests__/LevelPage.test.tsx` — covers TUTO-01 component gate
- [ ] `src/components/__tests__/StepCard.test.tsx` — covers TUTO-03 step interaction
- [ ] `src/components/__tests__/AchievementOverlay.test.tsx` — covers TUTO-02 overlay
- [ ] `src/components/__tests__/CodeBlock.test.tsx` — covers TUTO-05 (mock `navigator.clipboard`)
- [ ] `src/app/actions/__tests__/progress.test.ts` — covers TUTO-04 server action (mock `db`)

**No new framework install needed** — Vitest + Testing Library are already installed and configured.

**navigator.clipboard mock required** for CodeBlock tests:
```typescript
// In test file setup or beforeEach
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});
```

---

## State of the Art

| Old Approach | Current Approach | Changed In | Impact for Phase 2 |
|--------------|------------------|------------|-------------------|
| `params.slug` (sync) | `await params` or `React.use(params)` | Next.js 15+ | Must await params in all dynamic routes |
| `tailwind.config.js` theme | `@theme inline` in CSS | Tailwind v4 | No JS config file; CSS-first only |
| `execCommand('copy')` | `navigator.clipboard.writeText()` | Browser standard deprecation | Clipboard API required |
| Custom Progress component | Radix UI via shadcn | shadcn ecosystem | Use `npx shadcn@latest add progress` |
| shadcn with Tailwind v3 config | shadcn 4.x auto-detects Tailwind v4 | shadcn 4.x (2024) | No manual config bridge needed |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Deprecated. Use `navigator.clipboard.writeText()`.
- `tailwind.config.js`: Not applicable to Tailwind v4. Do not create.
- `next/router` (Pages Router): Do not import. All hooks come from `next/navigation`.

---

## Open Questions

1. **Cross-device progress sync on load**
   - What we know: Phase 2 writes progress to DB on each step/level complete.
   - What's unclear: Should the client load DB progress on first mount (overwriting localStorage) to enable cross-device resume?
   - Recommendation: For Phase 2, localStorage is the primary read source. DB is write-through. Cross-device sync is a v2 enhancement. The planner should note this as a known limitation.

2. **What counts as "linked to LinkedIn user ID" (TUTO-04)?**
   - What we know: The `users` table has `sessionId` (UUID, stored in localStorage) but NOT a LinkedIn-specific ID (the project uses form registration, not OAuth).
   - What's unclear: "LinkedIn user ID" in TUTO-04 likely means the `users.id` (the app's UUID for the user), not a literal LinkedIn API ID.
   - Recommendation: Use `users.id` (or look up via `sessionId`) as the foreign key for the `progress` table. Rename TUTO-04's intent to "linked to their user record" in implementation comments.

3. **Tutorial content shape for Phase 3 compatibility**
   - What we know: Phase 3 fills in content. Phase 2 must define the content slot interface.
   - What's unclear: Exact shape of "level data" (title, steps array, step content).
   - Recommendation: Define a `LevelData` interface in Phase 2 with placeholder data for all 7 levels. Phase 3 replaces the placeholder strings with real content without touching component code.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` — params as Promise, `await params` pattern, Client Component `React.use(params)`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md` — `useRouter` from `next/navigation`, `router.push`, `router.replace`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — when to use Client vs Server Components
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` — server actions pattern, `'use server'` directive
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` — Tailwind v4 CSS-first, `@import "tailwindcss"`, no config file
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md` — `redirect()` from `next/navigation`
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` — `'use client'` directive usage
- `node_modules/drizzle-orm/pg-core/columns/` — directory listing confirms `jsonb.d.ts` exists (jsonb column type available)
- `src/app/globals.css` — existing `@theme inline` pattern confirmed Tailwind v4 CSS-first
- `src/test-setup.ts` — custom localStorage mock pattern established in Phase 1
- `src/components/__tests__/SessionGuard.test.tsx` — `vi.mock('next/navigation')` pattern for testing
- `.planning/phases/02-tutorial-shell-progress-engine/02-UI-SPEC.md` — locked design decisions (approved 2026-04-03)

### Secondary (MEDIUM confidence)

- `npm view shadcn version` → 4.1.2 (CLI version verified via npm registry)
- `npm view lucide-react version` → 1.7.0 (verified via npm registry)
- `npm view @radix-ui/react-progress version` → 1.1.8 (verified via npm registry)
- `npm view tailwind-merge version` → 3.5.0 (verified via npm registry)
- `node_modules/next/dist/docs/01-app/02-guides/tailwind-v3-css.md` — confirms Tailwind v4 is separate from v3 setup; v3 guide explicitly says "For the latest Tailwind 4 setup, see the CSS guide"

### Tertiary (LOW confidence)

- None — all critical claims verified against installed package source or official Next.js in-repo docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified from installed packages and npm registry
- Architecture: HIGH — patterns verified against in-repo Next.js 16 docs
- Tailwind v4 patterns: HIGH — verified against `globals.css` (already working) and Next.js CSS guide
- Pitfalls: HIGH — each pitfall traced to a specific verified doc or existing project code
- Progress persistence design: MEDIUM — dual-write strategy is standard pattern; specific Drizzle upsert syntax verified from package type signatures

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable stack; Tailwind v4 and Next.js 16 APIs are unlikely to shift in 30 days)
