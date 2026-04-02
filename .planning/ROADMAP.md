# Roadmap: Claude Code Mastery Tutorial Lead Magnet

## Overview

Six phases take the project from zero to a publicly shareable lead magnet. Auth ships first to absorb the LinkedIn OIDC approval wait (1-3 days external dependency). The tutorial engine comes next so content has a working shell to load into. Tutorial content is its own phase — it is the hardest creative work and the core product value. Certificate and sharing mechanics close the viral loop. The landing page and visual polish come last when the full product is known. A hardening phase gates the actual launch to real LinkedIn users.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation + Auth** - LinkedIn OIDC registration, sessions, and route protection
- [ ] **Phase 2: Tutorial Shell + Progress Engine** - 7-level skeleton with unlock logic and persistent progress
- [ ] **Phase 3: Tutorial Content — 7 Levels** - Author all levels: concepts, steps, code blocks, error callouts
- [ ] **Phase 4: Certificate + Sharing** - Personalized PNG certificate, public page, download, LinkedIn share
- [ ] **Phase 5: Landing Page + Polish** - Conversion landing, redirect logic, visual animations, mobile layout
- [ ] **Phase 6: Pre-Launch Hardening** - LinkedIn Production Mode approval, smoke test, env documentation

## Phase Details

### Phase 1: Foundation + Auth
**Goal**: Users can sign in with LinkedIn and have a persistent, protected session
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. A user clicks "Continuar con LinkedIn" and completes OAuth — a user record is created in Neon with name, email (nullable), and picture URL
  2. The user returns 5 days later and is still logged in without re-authenticating (30-day session)
  3. An unauthenticated visitor who navigates to `/tutorial/1` is redirected to the landing page, not shown an error
  4. The LinkedIn Developer App is submitted for OIDC product approval (external dependency started)
**Plans**: TBD

### Phase 2: Tutorial Shell + Progress Engine
**Goal**: A logged-in user can navigate a 7-level tutorial where progress persists across sessions
**Depends on**: Phase 1
**Requirements**: TUTO-01, TUTO-02, TUTO-03, TUTO-04, TUTO-05, TUTO-06
**Success Criteria** (what must be TRUE):
  1. A user at Level 1 cannot access Level 2 — the next level is locked until the current one is explicitly completed
  2. Completing a level triggers a visible unlock animation or clear state change before Level N+1 becomes accessible
  3. A user who completes Level 3, closes the browser, and returns finds themselves at Level 4 (their saved position), not Level 1
  4. Every tutorial page shows a "Nivel X de 7" macro progress indicator without the user needing to scroll or navigate
  5. Code blocks are visually distinct from prose and have a working 1-click copy button
**Plans**: TBD
**UI hint**: yes

### Phase 3: Tutorial Content — 7 Levels
**Goal**: All 7 tutorial levels are authored — each one teaches a Claude Code concept through building the personal management bot
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. Every level has at least one terminal command or code block the user copies and runs, plus an explanation of what it does and why
  2. Every step in every level has at least one collapsible error callout covering the most likely failure mode for that step
  3. After completing each level, the user sees a "Qué lograste" card summarizing the concrete output of that level before the next unlocks
  4. A user who already has Claude Code installed can complete all 7 levels in under 60 minutes (manually verified by the creator)
  5. The 7 levels follow the specified progression: Nivel 0 (Chatbot) → Nivel 1 (Plan Mode) → Nivel 2 (CLAUDE.md) → Nivel 3 (Commands, Skills, Hooks) → Nivel 4 (MCP Servers) → Nivel 5 (GSD Framework) → Nivel 6 (Sub-agentes) → Nivel 7 (Flujos autónomos)
**Plans**: TBD

### Phase 4: Certificate + Sharing
**Goal**: A user who completes all 7 levels receives a personalized, downloadable certificate they can share on LinkedIn in two clicks
**Depends on**: Phase 3
**Requirements**: CERT-01, CERT-02, CERT-03, CERT-04, CERT-05
**Success Criteria** (what must be TRUE):
  1. The certificate PNG includes the user's LinkedIn name, the levels completed, ZalesMachine branding, and the completion date
  2. Visiting `/certificate/[userId]` from a logged-out browser (or LinkedIn's link crawler) returns an HTML page with correct `og:image`, `og:title`, and `og:description` meta tags
  3. Clicking "Descargar certificado" downloads the PNG file to the user's device without opening a new tab
  4. Clicking "Compartir en LinkedIn" opens LinkedIn's share dialog with the certificate URL pre-populated
  5. The completion screen includes a pre-written post text block with the user's name and tutorial URL that copies to clipboard in one click
**Plans**: TBD
**UI hint**: yes

### Phase 5: Landing Page + Polish
**Goal**: The public landing page converts LinkedIn visitors to registered users, authenticated users are redirected to their progress, and the full flow is visually polished
**Depends on**: Phase 4
**Requirements**: LAND-01, LAND-02, LAND-03
**Success Criteria** (what must be TRUE):
  1. A first-time visitor sees the value proposition (what they will build), the time estimate, and ZalesMachine branding before any login prompt
  2. The landing page has exactly one CTA — "Comenzar con LinkedIn" — which initiates the LinkedIn OAuth flow
  3. An authenticated user who visits `/` is automatically redirected to their current tutorial level without seeing the landing page
**Plans**: TBD
**UI hint**: yes

### Phase 6: Pre-Launch Hardening
**Goal**: The app is safe to share with real LinkedIn users — Production Mode is active, redirect URIs are verified, and environment is documented
**Depends on**: Phase 5
**Requirements**: (none — operational readiness)
**Success Criteria** (what must be TRUE):
  1. A LinkedIn account NOT listed as a test user in the Developer Portal can complete the full sign-in flow without errors
  2. All environment variables are documented in `.env.example` with descriptions, including the exact redirect URI format
  3. The OAuth redirect URI registered in the LinkedIn Developer Portal matches the production Vercel URL exactly (trailing slash included if applicable)
  4. A full end-to-end smoke test (landing → login → Level 1 → Level 7 → certificate → LinkedIn share) passes on the production deployment
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Auth | 0/? | Not started | - |
| 2. Tutorial Shell + Progress Engine | 0/? | Not started | - |
| 3. Tutorial Content — 7 Levels | 0/? | Not started | - |
| 4. Certificate + Sharing | 0/? | Not started | - |
| 5. Landing Page + Polish | 0/? | Not started | - |
| 6. Pre-Launch Hardening | 0/? | Not started | - |
