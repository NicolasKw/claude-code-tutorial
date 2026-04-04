# Claude Code Mastery — Tutorial Interactivo (Lead Magnet)

## What This Is

Web app de tutorial interactivo y lineal donde el usuario aprende los 7 niveles de Claude Code construyendo un bot de gestión personal. Pensado como lead magnet de un post de LinkedIn: el usuario entra, se registra con nombre y perfil de LinkedIn, completa el tutorial (~56 min), obtiene un certificado PNG personalizado compartible en LinkedIn, y sigue al creador.

**Shipped v1.0 (2026-04-04):** Registration form → 7-level tutorial engine → authored content in Spanish → certificate + LinkedIn sharing. 13 plans, 3,592 lines TypeScript, 111 tests green.

## Core Value

El usuario termina el tutorial con un bot de gestión personal funcionando en su máquina — no solo teoría, sino algo que puede usar el día siguiente.

## Requirements

### Validated

- ✓ Usuario puede registrarse con nombre + perfil de LinkedIn (email opcional) — v1.0
- ✓ Tutorial lineal de 7 niveles, desbloqueables en orden (como niveles de un juego) — v1.0
- ✓ Progreso del usuario persiste entre sesiones (puede pausar y continuar) — v1.0
- ✓ Cada nivel enseña un concepto de Claude Code con pasos, comandos y error callouts — v1.0
- ✓ El "hilo conductor" del tutorial es construir un bot de gestión personal — v1.0
- ✓ El tutorial es completable en ~1 hora (~56 min estimado con 3-5 pasos/nivel) — v1.0
- ✓ Al completar todos los niveles, el usuario recibe un certificado PNG personalizado con su nombre y fecha — v1.0
- ✓ El badge es compartible directamente en LinkedIn (imagen descargable + texto pre-escrito para el post) — v1.0
- ✓ El tutorial funciona guiando al usuario paso a paso en su propia máquina — v1.0

### Active

- [ ] La landing page (pública, pre-registro) muestra propuesta de valor, tiempo estimado (~1 hora), branding ZalesMachine
- [ ] La landing page tiene un único CTA que inicia el flujo de registro
- [ ] Los usuarios autenticados que visitan la landing son redirigidos automáticamente a su nivel actual

### Out of Scope

- Simulador de Claude Code en el browser — demasiado complejo y desvirtúa el propósito (que instalen y usen Claude Code real)
- Múltiples caminos / paths no-lineales — el tutorial es lineal y único
- Agente de LinkedIn post writer como proyecto del tutorial — conflicto comercial
- Gamificación avanzada (puntos, rankings, leaderboards) — v2
- Modo multiplayer / colaborativo — no aplica al caso de uso
- LinkedIn OAuth / OIDC — solo formulario simple; no se necesita OAuth ni aprobación de LinkedIn Developer App
- Dark mode — v2+

## Context

El proyecto nace de un post de LinkedIn que viralizó sobre "7 niveles de Claude Code". El contenido del tutorial fue creado desde cero en español para audiencia latinoamericana (dueños de negocio no-técnicos).

**v1.0 tech stack:** Next.js 16.2.2, TypeScript, Tailwind v4, Drizzle ORM, Supabase Postgres, next/og (ImageResponse), Vitest, shadcn/ui (base-nova style). No Auth.js — registro por formulario simple con session ID en localStorage.

**Known tech debt (v1.0):**
- `NEXT_PUBLIC_BASE_URL` needs to be added to `.env.example` for production OG image URLs
- `saveProgress` not re-exported from `@/app/actions/index.ts` barrel
- Nyquist VALIDATION.md frontmatter never updated to `nyquist_compliant: true` despite Wave 0 tests passing
- 14 pending human verifications (visual/animation checks + LinkedIn Post Inspector)

## Constraints

- **Audiencia**: Dueños de negocio no-técnicos — la UX debe ser extremadamente simple y guiada
- **Duración**: El tutorial no puede exceder 1 hora de tiempo real
- **Idioma**: Español (audiencia latinoamericana)
- **Contenido**: El "qué construir" en el tutorial NO puede ser un LinkedIn post writer (conflicto comercial)
- **Modelo de negocio**: Lead magnet gratuito — sin paywall dentro del tutorial

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bot de gestión personal como proyecto del tutorial | Útil para dueños de negocio, aplica naturalmente todos los niveles, no compite con productos del creador | ✓ Good — content flows naturally across all 7 levels |
| Registro con formulario simple (no OAuth) | Sin LinkedIn Developer App approval, sin Auth.js complexity | ✓ Good — shipped in Phase 1 in 2 plans |
| Tutorial en la máquina del usuario (no simulado) | El objetivo es que el usuario REALMENTE use Claude Code | ✓ Good — validates the core value |
| Certificado/badge compartible en LinkedIn | Mecanismo de viralización | ✓ Good — Phase 4 complete with OG meta, download, share |
| Next.js App Router + Drizzle + Supabase | Modern stack, no extra auth complexity | ✓ Good — clean separation of server actions and client hooks |
| localStorage dual-write (progress + DB) | Optimistic UX while DB syncs | ✓ Good — resilient to slow DB connections |
| shadcn base-nova style (Tailwind v4) | CLI auto-selected for Tailwind v4 compatibility | ✓ Good — functionally equivalent to new-york |
| `isLevelLocked = level > currentLevel` | Simple integer comparison, no edge cases | ⚠️ Revisit — caused INT-01 bug when registration redirect used 1-based level numbering; fixed in v1.0 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-04 after v1.0 milestone*
