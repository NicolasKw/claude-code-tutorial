# Claude Code Mastery — Tutorial Interactivo (Lead Magnet)

## What This Is

Web app de tutorial interactivo y lineal donde el usuario aprende los 7 niveles de Claude Code construyendo un bot de gestión personal. Pensado como lead magnet de un post de LinkedIn: el usuario entra, completa el tutorial (~1 hora), obtiene un certificado/badge compartible en LinkedIn, y sigue al creador. El acceso requiere registro con perfil de LinkedIn.

## Core Value

El usuario termina el tutorial con un bot de gestión personal funcionando en su máquina — no solo teoría, sino algo que puede usar el día siguiente.

## Requirements

### Validated

- [x] Tutorial lineal de 7 niveles, desbloqueables en orden — Validated in Phase 02: tutorial-shell-progress-engine
- [x] Progreso del usuario persiste entre sesiones — Validated in Phase 02: tutorial-shell-progress-engine (useProgress hook + DB via server actions)
- [x] Cada nivel enseña un concepto de Claude Code con pasos, comandos y error callouts — Validated in Phase 03: tutorial-content-7-levels
- [x] El "hilo conductor" es construir un bot de gestión personal — Validated in Phase 03: tutorial-content-7-levels (content in Spanish, 7 levels, ~56 min estimated)
- [x] El tutorial es completable en ~1 hora — Validated in Phase 03: tutorial-content-7-levels (3-5 steps/level × 7 = ~56 min, enforced by tests)

### Active

- [ ] Usuario puede registrarse con su perfil de LinkedIn para acceder al tutorial
- [ ] Tutorial lineal de 7 niveles, desbloqueables en orden (como niveles de un juego)
- [ ] Cada nivel enseña un concepto de Claude Code y el usuario lo practica en su propia máquina
- [ ] El "hilo conductor" del tutorial es construir un bot de gestión personal (procesa notas/emails, prioriza tareas, genera resumen diario)
- [ ] El tutorial es completable en ~1 hora
- [ ] Al completar todos los niveles, el usuario recibe un certificado/badge personalizado con su nombre y nivel alcanzado
- [ ] El badge es compartible directamente en LinkedIn (imagen descargable + texto pre-escrito para el post)
- [ ] Progreso del usuario persiste entre sesiones (puede pausar y continuar)
- [ ] El tutorial funciona guiando al usuario paso a paso — el usuario ejecuta Claude Code en su propia máquina, no en el browser

### Out of Scope

- Simulador de Claude Code en el browser — demasiado complejo y desvirtúa el propósito (que instalen y usen Claude Code real)
- Múltiples caminos / paths no-lineales — el tutorial es lineal y único
- Agente de LinkedIn post writer — el creador vende un producto similar, no se puede replicar
- Gamificación avanzada (puntos, rankings, leaderboards) — v2
- Modo multiplayer / colaborativo — no aplica al caso de uso

## Context

El proyecto nace de un post de LinkedIn que viralizó sobre "7 niveles de Claude Code". Mucha gente escribió pidiendo ayuda para aprender. El tutorial adapta el contenido del post + un video de YouTube de referencia (que construye un LinkedIn post writer — no se puede copiar porque el creador vende algo similar). El contenido del tutorial debe crearse desde cero usando como base:
- El post de LinkedIn (7 niveles descritos)
- La transcripción del video de YouTube (conceptos y flujo pedagógico)
- El repositorio del video (patrones técnicos y ejemplos)

El creador tiene audiencia principalmente hispanohablante en LinkedIn (dueños de negocio que quieren implementar IA sin depender de técnicos).

El acceso vía LinkedIn sirve doble propósito: capturar el lead (nombre, email, perfil) y personalizar el certificado final.

## Constraints

- **Audiencia**: Dueños de negocio no-técnicos — la UX debe ser extremadamente simple y guiada
- **Duración**: El tutorial no puede exceder 1 hora de tiempo real (incluyendo instalación de herramientas si el usuario no las tiene)
- **Idioma**: Español (audiencia latinoamericana)
- **Contenido**: El "qué construir" en el tutorial NO puede ser un LinkedIn post writer (conflicto comercial)
- **Modelo de negocio**: Lead magnet gratuito — sin paywall dentro del tutorial

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bot de gestión personal como proyecto del tutorial | Útil para dueños de negocio, aplica naturalmente todos los niveles, no compite con productos del creador | — Pending |
| Registro con LinkedIn (no email) | Captura dato de mayor valor para el creador + personaliza el certificado | — Pending |
| Tutorial en la máquina del usuario (no simulado) | El objetivo es que el usuario REALMENTE use Claude Code, no que simule | — Pending |
| Certificado/badge compartible en LinkedIn | Mecanismo de viralización — el usuario tiene incentivo para compartir | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 — Phase 03 complete (3/4 phases done)*
