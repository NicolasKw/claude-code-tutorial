# Milestones

## v1.0 MVP (Shipped: 2026-04-04)

**Phases completed:** 4 phases, 13 plans, 15 tasks

**Key accomplishments:**

- Next.js 16.2.2 + Drizzle/Neon + Zod registrationSchema + localStorage session helpers + 12 Vitest tests green
- Complete registration flow: Server Action (Zod validation + Drizzle insert), RegistrationForm (useActionState + localStorage), SessionGuard (client-side route protection), 24 tests green, build clean
- 54 it.todo Vitest stubs across 8 files defining the full behavioral contract for tutorial shell, progress engine, and achievement overlay before any implementation
- One-liner:
- 1. [Rule 2 - Missing Critical Setup] Added jest-dom to test-setup.ts
- Interactive tutorial shell with StepCard, AchievementOverlay, and LevelPage wiring complete navigation flow — 63 tests passing, build clean
- ErrorCalloutContent/StepContent/LevelContent types, collapsible ErrorCallout component with amber HTML details/summary, and 11 it.todo() Wave 0 stubs covering CONT-01 through CONT-05
- Typed Spanish tutorial content for Levels 0-3 (Chatbot → Plan Mode → CLAUDE.md → Commands/Skills/Hooks) in src/lib/content/levels.ts, 14 steps total, every step with real terminal commands and error callouts
- Typed Spanish tutorial content for Levels 4-6 (MCP Servers, GSD Framework, Sub-agentes y Flujos Autonomos) appended to src/lib/content/levels.ts — 12 steps total, every step with real terminal commands or explanations and error callouts, completing the full 7-level tutorial
- Task 1 — LevelPage content integration:
- userId plumbing:
- Public /certificate/[userId] page with OG meta tags (og:image absolute URL, og:title, og:description) and CertificatePage client component implementing download (fetch+blob), LinkedIn share (window.open), and clipboard copy with 2s "Copiado" state
- saveProgress sets completedAt once on all-7-levels complete; LevelPage routes to /certificate/[userId] on final level; getUserForCertificate query tested with real db chain mocks

---
