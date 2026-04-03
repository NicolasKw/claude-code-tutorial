# Phase 3: Tutorial Content — 7 Levels - Research

**Researched:** 2026-04-03
**Domain:** Tutorial content authoring — React data file pattern, new ErrorCallout component, LevelPage wiring, 60-minute pedagogical budget
**Confidence:** HIGH

---

## Summary

Phase 3 is primarily a **content authoring phase**, not an infrastructure phase. The tutorial shell (LevelPage, StepCard, AchievementOverlay, CodeBlock, useProgress) was fully built in Phase 2. Phase 3 replaces `PLACEHOLDER_STEPS` in `LevelPage.tsx` with real step definitions and provides real `summary` strings to `AchievementOverlay`. The only new component required is `ErrorCallout` — a collapsible error/solution block — which CONT-02 mandates on every step.

The primary engineering decision is **where tutorial content lives**. The correct pattern for this stack (Next.js App Router, no CMS) is a **TypeScript data file** (`src/lib/content/levels.ts`) that exports a typed array of level definitions. `LevelPage` imports from this file and passes content to StepCard as JSX children. This keeps content separate from component logic, lets TypeScript catch missing fields, and makes content editing straightforward without touching component internals.

The seven levels teach Claude Code concepts progressively via a personal management bot. The content must be concrete: every step must include at least one real terminal command or code block that the user actually runs. The 60-minute constraint (CONT-05) is the hardest creative constraint — it limits levels to roughly 7-10 minutes each, which translates to 3-5 steps per level at 1-2 minutes per step.

**Primary recommendation:** Create `src/lib/content/levels.ts` with typed level definitions, add `ErrorCallout` component with collapsible HTML `<details>`/`<summary>`, wire `LevelPage` to consume from the data file, and author all 7 levels with real commands inside the time budget.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Each level includes concept explanation + concrete terminal instructions | Covered by StepCard children (JSX content) + CodeBlock component already built. New: typed step data with `codeBlock` field. |
| CONT-02 | Each step includes collapsible error callouts ("Si ves este error, hacé esto") | New: `ErrorCallout` component using HTML `<details>`/`<summary>` — one per step minimum. |
| CONT-03 | After each level, user sees "Qué lograste" card before next unlocks | Already built: `AchievementOverlay` accepts `summary` prop (currently placeholder). Phase 3 provides real strings. |
| CONT-04 | 7 levels covering the specified progression (Nivel 0-7) building personal management bot | New: authored content in `src/lib/content/levels.ts` for all 7 levels. |
| CONT-05 | Total completion time under 60 minutes for user with Claude Code installed | Design constraint on step count per level: 3-5 steps × 7 levels = 21-35 steps total; budget ~2 min/step. |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

**CRITICAL — enforced by AGENTS.md:**

> "This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices."

**Directive for every executor:** Before writing any Next.js-touching code in Phase 3, read:
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`

Phase 3 touches `LevelPage.tsx` (client component) but not routing. The client/server boundary is already established; content authoring does not change it.

---

## Standard Stack

### Core (all installed — no new installs required)

| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| next | 16.2.2 | App Router, client components | Already installed |
| react | 19.2.4 | JSX, useState, client hooks | Already installed |
| tailwindcss | 4.2.2 | CSS utilities | Already installed |
| lucide-react | 1.7.0 | Icons (ChevronDown for ErrorCallout expand) | Already installed |
| @testing-library/react | 16.3.2 | Component testing | Already installed |
| vitest | 4.1.2 | Test runner | Already installed |

### No new installs needed

Phase 3 does not add dependencies. All UI primitives (Button, Card, CodeBlock) are already built. The only new code is:
1. `src/lib/content/levels.ts` — data file (pure TypeScript)
2. `src/components/tutorial/ErrorCallout.tsx` — new component (no new library)
3. Modifications to `LevelPage.tsx` to consume content from the data file

---

## Architecture Patterns

### Recommended File Structure Changes

```
src/
├── lib/
│   ├── content/
│   │   └── levels.ts        # NEW — all 7 level definitions as typed data
│   └── types/
│       └── tutorial.ts      # EXTEND — add StepContent, LevelContent types
├── components/
│   └── tutorial/
│       ├── ErrorCallout.tsx  # NEW — collapsible error callout
│       └── LevelPage.tsx     # MODIFY — consume content from levels.ts
```

### Pattern 1: Typed Content Data File

**What:** A single `src/lib/content/levels.ts` exports a typed array of `LevelContent` objects. `LevelPage` imports from it by level number.

**When to use:** Always — this is the single source of truth for all level content. Never inline content in components.

**Type definitions (extend `src/lib/types/tutorial.ts`):**
```typescript
// Extend existing src/lib/types/tutorial.ts

export interface ErrorCalloutContent {
  trigger: string;    // "Si ves este error:"
  error: string;      // the error message / condition
  solution: string;   // what to do to fix it
}

export interface StepContent {
  title: string;
  explanation: string;      // prose explaining what and why
  codeBlock?: {
    code: string;
    language: string;       // "bash" | "typescript" | "json" etc
  };
  errorCallouts: ErrorCalloutContent[];  // minimum 1 per step (CONT-02)
}

export interface LevelContent {
  level: number;        // 0-6
  title: string;        // e.g. "Chatbot"
  subtitle: string;     // e.g. "Tu primer conversación con Claude Code"
  summary: string;      // shown in AchievementOverlay "Qué lograste" card
  steps: StepContent[]; // minimum 3, maximum 5 for time budget
}
```

**Content file skeleton:**
```typescript
// src/lib/content/levels.ts
import type { LevelContent } from '@/lib/types/tutorial';

export const LEVEL_CONTENT: LevelContent[] = [
  {
    level: 0,
    title: 'Nivel 0: Chatbot',
    subtitle: '...',
    summary: '...',
    steps: [ /* 3-5 steps */ ],
  },
  // ... levels 1-6
];

export function getLevelContent(level: number): LevelContent | undefined {
  return LEVEL_CONTENT.find(l => l.level === level);
}
```

### Pattern 2: LevelPage Content Wiring

**What:** Replace `PLACEHOLDER_STEPS` in `LevelPage.tsx` with a call to `getLevelContent(level)`. Pass step content as JSX children to StepCard.

**Current stub (to replace):**
```typescript
// BEFORE (Phase 2 stub in LevelPage.tsx)
const PLACEHOLDER_STEPS = [
  { title: 'Paso 1', content: 'Contenido del paso 1 (se agrega en Fase 3)' },
  ...
];
```

**Replacement pattern:**
```typescript
// AFTER (Phase 3 wiring in LevelPage.tsx)
import { getLevelContent } from '@/lib/content/levels';
import { ErrorCallout } from '@/components/tutorial/ErrorCallout';

// Inside LevelPage component:
const levelData = getLevelContent(level);
const steps = levelData?.steps ?? [];

// In JSX, pass real content to StepCard children:
<StepCard
  key={stepIndex}
  stepIndex={stepIndex}
  isCompleted={isStepCompleted(level, stepIndex)}
  isFinalStep={stepIndex === steps.length - 1}
  onComplete={() => completeStep(level, stepIndex)}
  onLevelComplete={() => { completeLevel(level); setShowOverlay(true); }}
>
  <p className="font-semibold text-base">{step.title}</p>
  <p className="text-base text-[#171717]">{step.explanation}</p>
  {step.codeBlock && (
    <CodeBlock code={step.codeBlock.code} language={step.codeBlock.language} />
  )}
  {step.errorCallouts.map((callout, i) => (
    <ErrorCallout key={i} {...callout} />
  ))}
</StepCard>
```

**AchievementOverlay summary wiring:**
```typescript
// Pass real summary from levelData
<AchievementOverlay
  show={showOverlay}
  level={level}
  summary={levelData?.summary}
  onNavigate={() => router.push(`/tutorial/${level + 1}`)}
/>
```

### Pattern 3: ErrorCallout Component

**What:** A collapsible block using native HTML `<details>`/`<summary>` (no JS state needed). Shows error condition; expands to reveal solution.

**Why `<details>` not useState:** `<details>`/`<summary>` is natively collapsible, accessible (keyboard operable), and requires zero JS. For a 'use client' component file, useState works but adds unnecessary overhead.

**Implementation:**
```typescript
// src/components/tutorial/ErrorCallout.tsx
// 'use client' NOT needed — no React state, uses native <details>

import type { ErrorCalloutContent } from '@/lib/types/tutorial';

export function ErrorCallout({ trigger, error, solution }: ErrorCalloutContent) {
  return (
    <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-amber-800 select-none">
        {trigger} — {error}
      </summary>
      <p className="mt-2 text-sm text-amber-900 leading-relaxed">{solution}</p>
    </details>
  );
}
```

**Brand note:** Amber/warning colors are not defined in the brand palette (only `--brand-primary`, `--brand-secondary`, `--brand-success`). ErrorCallout can use Tailwind's built-in amber scale — this is appropriate for warning/error semantics, or the planner may choose to use an inline style. Confirm with brand if needed.

### Pattern 4: Content Authoring for 7 Levels

**The level map (from CONT-04 / ROADMAP):**

| Level | Topic | Bot Milestone |
|-------|-------|---------------|
| 0 | Chatbot | First conversation with Claude Code in chat mode |
| 1 | Plan Mode | Run first plan with `claude --plan` or `/plan` command |
| 2 | CLAUDE.md | Create project memory file for the bot project |
| 3 | Commands, Skills, Hooks | Add `/commands`, skill files, and lifecycle hooks |
| 4 | MCP Servers | Connect an MCP server (e.g., filesystem or fetch) |
| 5 | GSD Framework | Introduce the GSD workflow framework for structured tasks |
| 6 | Sub-agentes | Spawn sub-agents; multi-step autonomous sequences |
| 7 | Flujos autónomos | Full autonomous workflow — bot executes without hand-holding |

**NOTE on level numbering:** ROADMAP says 8 levels (Nivel 0-7) but CONT-04 says "7 levels" and the shell supports levels 0-6 (`TOTAL_LEVELS = 7`, route validates `0 <= level <= 6`). The route `page.tsx` already enforces `levelNum > 6 → notFound()`. This means: 7 levels, numbered 0 through 6. The "Nivel 7 (Flujos autónomos)" from ROADMAP maps to level index 6 in the shell.

**Confirmed numbering (source: LevelPage.tsx and types/tutorial.ts):**
- `TOTAL_LEVELS = 7`
- Valid levels: 0, 1, 2, 3, 4, 5, 6
- Final level = 6 (shows "Ver mi certificado" in AchievementOverlay)

**Time budget per level (CONT-05 constraint):**
- Target: 7-9 minutes per level (8 avg × 7 = 56 minutes total)
- Steps per level: 3-5 (at ~2 minutes each including reading + running command)
- Levels 0 (setup) may be longer; levels 4-6 (advanced) can assume Claude Code literacy

### Anti-Patterns to Avoid

- **Inlining content in LevelPage.tsx:** Content and component code must be separated. If content is inline, it becomes impossible to edit without touching tested component files.
- **Missing `codeBlock` on setup steps:** CONT-01 requires at least one terminal command per level. Do not write levels where every step is prose-only.
- **Steps longer than 2 minutes:** CONT-05 forces brevity. Resist the urge to explain everything — the bot is the proof, not the explanation.
- **Missing ErrorCallout on any step:** CONT-02 is mandatory on every step. Do not author steps without at least one `errorCallout` entry in the data.
- **Using level indices as "Nivel X" in content copy:** The display labels ("Nivel 0", "Nivel 1", etc.) in content copy should match the 0-indexed level numbers since TutorialHeader displays "Nivel X de 7" using the level prop directly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Collapsible error disclosure | Custom useState toggle with chevron animation | Native `<details>`/`<summary>` HTML | Zero JS, keyboard accessible, browser renders natively, no animation library needed |
| Syntax highlighting in code blocks | Prism / Shiki / highlight.js | None — current CodeBlock shows plain monospace | CONT-01 only requires monospace + copy; syntax coloring is v2+. CodeBlock already built in Phase 2. |
| Content localization/CMS | Contentful, Sanity, MDX | TypeScript data file | This is a 7-level lead magnet, not a CMS project. Static data file is correct scale. |
| Step timing measurement | analytics events, timers | Manual creator validation | CONT-05 says "manually verified by creator" — no automated timing system needed |

---

## Common Pitfalls

### Pitfall 1: Level Count Mismatch (8 levels in ROADMAP vs 7 in shell)
**What goes wrong:** ROADMAP.md describes "Nivel 0 → Nivel 7" which looks like 8 levels. The shell `TOTAL_LEVELS = 7` and routes validate `0 <= level <= 6`. Authoring 8 levels causes level 7 to hit `notFound()`.
**Why it happens:** The roadmap description is conceptually labeled "Nivel 7" (zero-indexed names) but the shell was built for 7 slots (indices 0-6). Nivel 7 = slot 6.
**How to avoid:** Map the 8 named levels from ROADMAP onto indices 0-6 in `LEVEL_CONTENT`. Nivel 7 (Flujos autónomos) = `level: 6` in the data file. Never create a `level: 7` entry.

### Pitfall 2: Forgetting to Wire summary to AchievementOverlay
**What goes wrong:** The "Qué lograste" card shows placeholder text even after Phase 3.
**Why it happens:** `AchievementOverlay` accepts an optional `summary` prop; if not passed, it falls back to "Placeholder — el contenido se agrega en la Fase 3." Forgetting to pass `levelData?.summary` from LevelPage leaves the placeholder.
**How to avoid:** Wire `summary={levelData?.summary}` in `LevelPage.tsx` and include non-empty summary strings in every `LevelContent` object. Test: render AchievementOverlay with a real summary string.

### Pitfall 3: codeBlock Content Escaping in TypeScript String
**What goes wrong:** Multi-line bash commands with backticks or template literal syntax in the TypeScript data file cause parse errors.
**Why it happens:** Template literals cannot be nested without escaping, and bash heredocs use backticks.
**How to avoid:** Use regular string concatenation or tagged template literals carefully. For multi-line commands, use `\n` in regular strings or store as an array joined with newlines.

### Pitfall 4: Step-by-step Reveal Breaks with New Content
**What goes wrong:** LevelPage only reveals steps up to the first uncompleted step (`isStepVisible`). If the data file has 5 steps but tests expect only the first to be visible initially, tests may need updating.
**Why it happens:** Tests for LevelPage use `PLACEHOLDER_STEPS` (3 steps). When real content has a different step count, snapshot/count assertions break.
**How to avoid:** LevelPage tests mock `useProgress` and use the component's rendering logic — they don't depend on step count. Verify tests still pass after wiring real content. The `isStepVisible` logic is count-agnostic.

### Pitfall 5: ErrorCallout Not a 'use client' Component
**What goes wrong:** ErrorCallout uses `<details>`/`<summary>` which is native HTML. It does not need `'use client'`. If marked as client component, it works but wastes the optimization.
**Why it happens:** Developers assume all interactive UI needs `'use client'`.
**How to avoid:** Omit `'use client'` from ErrorCallout. It is a pure server-renderable component. (LevelPage is already client; ErrorCallout rendered inside it can be server or client — prefer server.)

---

## Code Examples

### ErrorCallout Component (authoritative pattern)
```tsx
// src/components/tutorial/ErrorCallout.tsx
// No 'use client' needed — native <details> requires no React state

import type { ErrorCalloutContent } from '@/lib/types/tutorial';

export function ErrorCallout({ trigger, error, solution }: ErrorCalloutContent) {
  return (
    <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-amber-800 select-none">
        {trigger} — {error}
      </summary>
      <p className="mt-2 text-sm text-amber-900 leading-relaxed">{solution}</p>
    </details>
  );
}
```

### Level 0 Content Example (Chatbot — sets the authoring pattern)
```typescript
// src/lib/content/levels.ts (partial)
{
  level: 0,
  title: 'Chatbot',
  subtitle: 'Tu primera conversación con Claude Code',
  summary: 'Instalaste Claude Code, lo ejecutaste en modo chat, y verificaste que responde. Tenés una herramienta de IA corriendo en tu propia máquina.',
  steps: [
    {
      title: 'Instalá Claude Code',
      explanation: 'Claude Code es una herramienta de línea de comandos. Se instala con npm una sola vez.',
      codeBlock: {
        code: 'npm install -g @anthropic-ai/claude-code',
        language: 'bash',
      },
      errorCallouts: [
        {
          trigger: 'Si ves este error',
          error: 'EACCES: permission denied',
          solution: 'Tu npm global prefix no tiene permisos de escritura. Corré: sudo npm install -g @anthropic-ai/claude-code  —  o mejor, configurá un npm prefix en tu home directory.',
        },
      ],
    },
    {
      title: 'Autenticá con tu cuenta Anthropic',
      explanation: 'Claude Code necesita una API key de Anthropic para funcionar. El comando de login abre el browser para autenticarte.',
      codeBlock: {
        code: 'claude login',
        language: 'bash',
      },
      errorCallouts: [
        {
          trigger: 'Si el browser no se abre',
          error: 'La autenticación no inicia',
          solution: 'Copiá la URL que aparece en la terminal y pegala manualmente en el browser.',
        },
      ],
    },
    {
      title: 'Iniciá una conversación en modo chat',
      explanation: 'claude sin argumentos abre el modo chat interactivo. Preguntá cualquier cosa para verificar que funciona.',
      codeBlock: {
        code: 'claude\n# Luego escribí: "Hola, ¿podés ayudarme a organizar mis tareas?"',
        language: 'bash',
      },
      errorCallouts: [
        {
          trigger: 'Si ves',
          error: 'command not found: claude',
          solution: 'npm no agregó el binario al PATH. Reiniciá la terminal, o agregá el npm global bin al PATH: export PATH="$(npm config get prefix)/bin:$PATH"',
        },
      ],
    },
  ],
},
```

### LevelPage Wiring (authoritative pattern)
```typescript
// src/components/tutorial/LevelPage.tsx — key changes only
import { getLevelContent } from '@/lib/content/levels';
import { ErrorCallout } from '@/components/tutorial/ErrorCallout';

export function LevelPage({ level }: LevelPageProps) {
  // ... existing hook setup ...
  const levelData = getLevelContent(level);
  const steps = levelData?.steps ?? [];

  // In JSX — replace PLACEHOLDER_STEPS mapping:
  return (
    // ... existing structure ...
    {steps.map((step, stepIndex) => {
      if (!isStepVisible(stepIndex)) return null;
      return (
        <StepCard
          key={stepIndex}
          stepIndex={stepIndex}
          isCompleted={isStepCompleted(level, stepIndex)}
          isFinalStep={stepIndex === steps.length - 1}
          onComplete={() => completeStep(level, stepIndex)}
          onLevelComplete={() => { completeLevel(level); setShowOverlay(true); }}
        >
          <p className="font-semibold text-base">{step.title}</p>
          <p className="text-base text-[#171717]">{step.explanation}</p>
          {step.codeBlock && (
            <CodeBlock code={step.codeBlock.code} language={step.codeBlock.language} />
          )}
          {step.errorCallouts.map((callout, i) => (
            <ErrorCallout key={i} {...callout} />
          ))}
        </StepCard>
      );
    })}
    // ...
    <AchievementOverlay
      show={showOverlay}
      level={level}
      summary={levelData?.summary}
      onNavigate={() => router.push(`/tutorial/${level + 1}`)}
    />
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `<details>` polyfills needed | Native `<details>`/`<summary>` supported in all modern browsers | No library needed for collapsible |
| CMS-driven tutorial content | TypeScript data file at correct scale for a 7-level lead magnet | No CMS integration cost |
| Custom clipboard API | `navigator.clipboard.writeText()` (already implemented in CodeBlock) | Already handled, no new work |

---

## Open Questions

1. **Amber color for ErrorCallout**
   - What we know: Brand palette has `--brand-primary` (lavender), `--brand-secondary` (sky blue), `--brand-success` (lime). No warning/error color defined.
   - What's unclear: Should ErrorCallout use Tailwind amber, or derive an error color from brand palette?
   - Recommendation: Use Tailwind `amber-50/amber-200/amber-800/amber-900` as semantically appropriate for warnings. Planner may choose to add a `--brand-warning` token or keep amber utilities inline.

2. **Level 6 final step: what happens after "Ver mi certificado"**
   - What we know: AchievementOverlay for level 6 shows "Ver mi certificado" button; `onNavigate` calls `router.push('/tutorial/7')` which hits `notFound()`.
   - What's unclear: Phase 4 builds the certificate page at `/certificate/[userId]`, not `/tutorial/7`. The navigation target for level 6 completion needs to change.
   - Recommendation: Phase 3 can author content and leave the navigation as-is (it breaks), OR update the AchievementOverlay `onNavigate` for level 6 to route to `/certificate/[sessionId]`. Safest: update the route in LevelPage for the final level during Phase 3 wiring so the completion flow is correct.

3. **CONT-05 validation is manual**
   - What we know: The requirement says "manually verified by creator" — no automated test.
   - What's unclear: How does the plan gate on this? It cannot be automated.
   - Recommendation: Include "Creator completes all 7 levels and records time" as a manual verification step in the plan's Wave 0 or as a post-execution human UAT item.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 3 is code and content authoring with no external service dependencies. The existing Supabase connection (from Phase 1/2) is used but not changed by this phase.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Each level has at least one CodeBlock rendered in StepCard | unit | `npx vitest run src/lib/__tests__/content.test.ts` | ❌ Wave 0 |
| CONT-02 | Each step has at least one ErrorCallout rendered | unit | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx` | ❌ Wave 0 |
| CONT-03 | AchievementOverlay receives non-empty summary string for each level | unit | `npx vitest run src/lib/__tests__/content.test.ts` | ❌ Wave 0 |
| CONT-04 | LEVEL_CONTENT has exactly 7 entries covering levels 0-6 | unit | `npx vitest run src/lib/__tests__/content.test.ts` | ❌ Wave 0 |
| CONT-05 | Under 60 minutes to complete | manual | N/A — creator walkthrough | Manual only |

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/__tests__/ErrorCallout.test.tsx src/lib/__tests__/content.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/__tests__/ErrorCallout.test.tsx` — covers CONT-02 (renders trigger, error, solution; collapsible details element)
- [ ] `src/lib/__tests__/content.test.ts` — covers CONT-01, CONT-03, CONT-04 (validates LEVEL_CONTENT shape: 7 entries, each has steps with codeBlock and errorCallouts, each has non-empty summary)
- [ ] CONT-05 has no automated test — manual UAT item in HUMAN-UAT.md

---

## Sources

### Primary (HIGH confidence)
- Source code — `src/components/tutorial/LevelPage.tsx`, `AchievementOverlay.tsx`, `StepCard.tsx`, `CodeBlock.tsx` (all inspected directly)
- Source code — `src/lib/types/tutorial.ts`, `src/app/tutorial/[level]/page.tsx` (level boundary 0-6 confirmed)
- Phase 2 SUMMARY `02-03-SUMMARY.md` — "PLACEHOLDER_STEPS in LevelPage.tsx — Phase 3 will replace"; "summary prop in AchievementOverlay defaults to placeholder — Phase 3 will provide real summaries"

### Secondary (MEDIUM confidence)
- MDN: `<details>` / `<summary>` elements — native HTML collapsible, no JS required, widely supported
- ROADMAP.md `Phase 3` section — level progression confirmed: Nivel 0 (Chatbot) → Nivel 1 (Plan Mode) → Nivel 2 (CLAUDE.md) → Nivel 3 (Commands, Skills, Hooks) → Nivel 4 (MCP Servers) → Nivel 5 (GSD Framework) → Nivel 6 (Sub-agentes) → Nivel 7 (Flujos autónomos)
- REQUIREMENTS.md CONT-01 through CONT-05 — all requirements read and mapped

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — inspected package.json and all Phase 2 components directly
- Architecture (content wiring pattern): HIGH — PLACEHOLDER_STEPS stub explicitly documented in Phase 2 summary as Phase 3's job; AchievementOverlay summary prop already wired
- New component (ErrorCallout): HIGH — native `<details>` pattern, no library uncertainty
- Content authoring (7 levels): MEDIUM — level topics are specified in ROADMAP/REQUIREMENTS; exact step count and command choices are the creator's creative work, not researchable
- Pitfalls: HIGH — level count mismatch (0-6 vs "Nivel 7") verified against source code

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable stack, no fast-moving dependencies added in this phase)
