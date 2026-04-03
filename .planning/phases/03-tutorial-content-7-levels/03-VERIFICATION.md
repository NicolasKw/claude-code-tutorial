---
phase: 03-tutorial-content-7-levels
verified: 2026-04-03T20:12:55Z
status: passed
score: 9/9 must-haves verified
re_verification: false
---

# Phase 3: Tutorial Content — 7 Levels Verification Report

**Phase Goal:** Author all 7 levels of tutorial content (Levels 0–6) — real, complete instructional content with steps, code blocks, and error callouts — and wire the UI to consume it.
**Verified:** 2026-04-03T20:12:55Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                         | Status     | Evidence                                                                                               |
|----|-----------------------------------------------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------|
| 1  | ErrorCallout renders a collapsible details/summary block with trigger, error, and solution    | VERIFIED   | `src/components/tutorial/ErrorCallout.tsx` uses `<details>` with `bg-amber-50`; 4 tests pass          |
| 2  | Test stubs exist for all CONT requirements (Wave 0 contract — converted to real assertions)   | VERIFIED   | `content.test.ts` has real `expect()` assertions for CONT-01 through CONT-05; no `it.todo()` remain   |
| 3  | Levels 0-3 each have 3-5 steps with real terminal commands                                    | VERIFIED   | `levels.ts` lines 4-276: levels 0-3, each 3-4 steps, every step with errorCallouts                    |
| 4  | Every step includes at least one error callout with trigger, error, and solution              | VERIFIED   | All 25 steps across 7 levels have ≥1 errorCallout; enforced by passing content tests                  |
| 5  | Level content follows specified progression: Chatbot → Plan Mode → CLAUDE.md → Commands...   | VERIFIED   | titles: "Chatbot", "Plan Mode", "CLAUDE.md", "Commands, Skills y Hooks" in levels 0-3                 |
| 6  | Levels 4-6 each have 3-5 steps; LEVEL_CONTENT has exactly 7 entries (0-6)                    | VERIFIED   | `levels.ts` lines 278-501: levels 4-6 present; `LEVEL_CONTENT.length === 7` confirmed by passing test |
| 7  | Level content covers MCP Servers, GSD Framework, Sub-agentes y Flujos Autonomos              | VERIFIED   | titles: "MCP Servers" (L4), "GSD Framework" (L5), "Sub-agentes y Flujos Autonomos" (L6)               |
| 8  | LevelPage renders real content from levels.ts instead of PLACEHOLDER_STEPS                   | VERIFIED   | `LevelPage.tsx` imports `getLevelContent`, `ErrorCallout`; `PLACEHOLDER_STEPS` absent                 |
| 9  | Content validation tests confirm all 7 levels meet CONT requirements                         | VERIFIED   | `npx vitest run` — 96 tests, 15 files, all passed                                                     |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact                                          | Expected                                           | Status     | Details                                                                      |
|---------------------------------------------------|----------------------------------------------------|------------|------------------------------------------------------------------------------|
| `src/lib/types/tutorial.ts`                       | ErrorCalloutContent, StepContent, LevelContent     | VERIFIED   | All 3 interfaces exported; existing TutorialProgress/TOTAL_LEVELS preserved  |
| `src/components/tutorial/ErrorCallout.tsx`        | Collapsible error callout component                | VERIFIED   | Exports `ErrorCallout`; uses `<details>`, `bg-amber-50`; no `use client`     |
| `src/components/__tests__/ErrorCallout.test.tsx`  | Unit tests for ErrorCallout                        | VERIFIED   | 4 tests, all pass                                                            |
| `src/lib/__tests__/content.test.ts`               | Real assertions for CONT-01 through CONT-05        | VERIFIED   | 11 tests with `expect()`, no `it.todo()`; all pass                           |
| `src/lib/content/levels.ts`                       | All 7 levels (0-6) with steps and error callouts   | VERIFIED   | 507 lines; LEVEL_CONTENT array with 7 entries; getLevelContent exported       |
| `src/components/tutorial/LevelPage.tsx`           | Wired to real content; no placeholders             | VERIFIED   | Imports getLevelContent, ErrorCallout, CodeBlock; summary prop wired         |
| `src/components/__tests__/LevelPage.test.tsx`     | Updated tests compatible with real content         | VERIFIED   | 5 tests pass; no placeholder text references                                 |

### Key Link Verification

| From                                        | To                                          | Via                                  | Status     | Details                                                        |
|---------------------------------------------|---------------------------------------------|--------------------------------------|------------|----------------------------------------------------------------|
| `ErrorCallout.tsx`                          | `src/lib/types/tutorial.ts`                 | `import type { ErrorCalloutContent }`| WIRED      | Line 1 of ErrorCallout.tsx                                     |
| `src/lib/content/levels.ts`                 | `src/lib/types/tutorial.ts`                 | `import type { LevelContent }`       | WIRED      | Line 1 of levels.ts                                            |
| `src/lib/__tests__/content.test.ts`         | `src/lib/content/levels.ts`                 | `import { LEVEL_CONTENT, getLevelContent }` | WIRED | Line 2 of content.test.ts                               |
| `src/components/tutorial/LevelPage.tsx`     | `src/lib/content/levels.ts`                 | `import { getLevelContent }`         | WIRED      | Line 10 of LevelPage.tsx; called at line 24                    |
| `src/components/tutorial/LevelPage.tsx`     | `src/components/tutorial/ErrorCallout.tsx`  | `import { ErrorCallout }`            | WIRED      | Line 11 of LevelPage.tsx; rendered at line 78                  |
| `src/components/tutorial/LevelPage.tsx`     | `src/components/tutorial/AchievementOverlay.tsx` | `summary={levelData?.summary}` | WIRED      | Line 88 of LevelPage.tsx passes summary from levelData         |

### Data-Flow Trace (Level 4)

| Artifact          | Data Variable | Source                         | Produces Real Data | Status    |
|-------------------|---------------|--------------------------------|--------------------|-----------|
| `LevelPage.tsx`   | `steps`       | `getLevelContent(level)?.steps`| Yes — static data file (levels.ts has 507 lines of real content) | FLOWING |
| `LevelPage.tsx`   | `levelData?.summary` | `getLevelContent(level)?.summary` | Yes — each of 7 levels has a non-empty summary string | FLOWING |

Note: `levels.ts` is a static data module, not a DB-backed API. Data-flow is direct (import → render). No disconnection risk.

### Behavioral Spot-Checks

| Behavior                                      | Command                                                    | Result                   | Status  |
|-----------------------------------------------|------------------------------------------------------------|--------------------------|---------|
| Full test suite passes                        | `npx vitest run`                                           | 96 passed, 0 failed      | PASS    |
| content.test.ts: 7 levels, all CONT IDs       | `npx vitest run src/lib/__tests__/content.test.ts`         | 11 tests passed          | PASS    |
| ErrorCallout tests                            | `npx vitest run src/components/__tests__/ErrorCallout.test.tsx` | 4 tests passed      | PASS    |
| LevelPage tests pass with real content        | `npx vitest run src/components/__tests__/LevelPage.test.tsx` | 5 tests passed         | PASS    |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                    | Status    | Evidence                                                                 |
|-------------|-------------|--------------------------------------------------------------------------------|-----------|--------------------------------------------------------------------------|
| CONT-01     | 03-02, 03-03, 03-04 | Each level includes explanation + terminal commands                  | SATISFIED | All 7 levels have ≥1 step with codeBlock (bash); enforced by passing test |
| CONT-02     | 03-01, 03-02, 03-03, 03-04 | Collapsible error callouts per step                          | SATISFIED | ErrorCallout component exists; every step has ≥1 errorCallout; tests GREEN |
| CONT-03     | 03-04       | "Qué lograste" card shows level summary on completion                          | SATISFIED | `summary` field in every LevelContent; wired to AchievementOverlay via `levelData?.summary` |
| CONT-04     | 03-02, 03-03, 03-04 | 7 levels covering bot de gestión personal progression               | SATISFIED | LEVEL_CONTENT has exactly levels 0-6; titles match specified progression  |
| CONT-05     | 03-02, 03-03, 03-04 | Tutorial completion under 60 minutes                                 | SATISFIED | All levels have 3-5 steps (~2 min/step = ~8 min/level × 7 = ~56 min); enforced by passing test |

**Orphaned requirements check:** No CONT requirements mapped to Phase 3 in REQUIREMENTS.md are missing from plans. All 5 CONT IDs (CONT-01 through CONT-05) appear in at least one plan's `requirements` field. No orphans.

### Anti-Patterns Found

No anti-patterns detected. Scan results:
- No `PLACEHOLDER`, `TODO`, `FIXME`, `XXX`, `HACK` patterns in key files
- No `PLACEHOLDER_STEPS` in LevelPage.tsx
- No `it.todo()` in content.test.ts (all converted to real assertions)
- No empty return stubs or static JSON responses

### Human Verification Required

#### 1. ErrorCallout expand/collapse interaction

**Test:** Open the tutorial at level 0 in a browser. Click the "Si ves este error — EACCES: permission denied" summary in the first step's error callout.
**Expected:** The `<details>` element toggles open, revealing the solution text. Clicking again collapses it.
**Why human:** The `<details>` native expand behavior requires a real browser; JSDOM does not emulate it.

#### 2. AchievementOverlay summary display

**Test:** Complete all steps of Level 0. Observe the overlay that appears.
**Expected:** The overlay shows the Level 0 summary text: "Instalaste Claude Code, lo ejecutaste en modo chat, y verificaste que responde..."
**Why human:** The overlay animation and conditional rendering require a real browser session with progress state mutations.

#### 3. LevelPage title and subtitle rendering

**Test:** Navigate to `/tutorial/0` in a running dev server.
**Expected:** The page shows "Chatbot" as the h1 heading and "Tu primera conversacion con Claude Code" as a subtitle below it.
**Why human:** Next.js server-side rendering requires a running server to verify the full page output.

### Gaps Summary

No gaps found. All 9 truths are verified, all artifacts are substantive and wired, all key links are confirmed present in source code, and the full test suite (96 tests across 15 files) passes without failures.

---

_Verified: 2026-04-03T20:12:55Z_
_Verifier: Claude (gsd-verifier)_
