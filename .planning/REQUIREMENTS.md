# Requirements — Claude Code Mastery Tutorial Lead Magnet

**Definido:** 2026-04-02
**Stack base:** Next.js 15 + Auth.js v5 (LinkedIn OIDC) + Neon Postgres + next/og + Vercel

---

## v1 Requirements

### AUTH — Autenticación

- [ ] **AUTH-01**: El usuario puede registrarse e iniciar sesión con su perfil de LinkedIn (OIDC). Se captura nombre, email (nullable), foto de perfil.
- [ ] **AUTH-02**: La sesión persiste por 30 días. El usuario no tiene que re-loguearse en cada visita.
- [ ] **AUTH-03**: Las rutas `/tutorial/*` están protegidas. Los usuarios no autenticados son redirigidos al landing page.

### TUTO — Motor de Tutorial

- [ ] **TUTO-01**: El tutorial tiene exactamente 7 niveles desbloqueables en orden estrictamente lineal. No se puede saltar niveles.
- [ ] **TUTO-02**: Al completar un nivel, el siguiente se desbloquea con feedback visual (animación o cambio de estado claro).
- [ ] **TUTO-03**: Cada nivel contiene múltiples pasos. El usuario avanza paso a paso confirmando con un botón "Listo, ya lo hice" (auto-atestación; sin verificación automática).
- [ ] **TUTO-04**: El progreso del usuario (niveles y pasos completados) se guarda en la base de datos, vinculado a su LinkedIn user ID. Al volver, el tutorial reanuda desde donde lo dejó.
- [ ] **TUTO-05**: Los comandos y bloques de código se muestran en fuente monospace con botón de copia en 1 click. Distinción visual clara del texto prose.
- [ ] **TUTO-06**: Un indicador de progreso macro visible en todas las páginas del tutorial muestra el nivel actual ("Nivel X de 7").

### CONT — Contenido del Tutorial

- [ ] **CONT-01**: Cada nivel incluye: explicación del concepto Claude Code + instrucciones concretas de qué ejecutar en la terminal del usuario.
- [ ] **CONT-02**: Cada paso incluye callouts colapsables con los errores más comunes y su solución ("Si ves este error, hacé esto").
- [ ] **CONT-03**: Al completar cada nivel, el usuario ve una card "Qué lograste" que resume el output concreto del nivel antes de que el siguiente se desbloquee.
- [ ] **CONT-04**: El contenido del tutorial cubre los 7 niveles de Claude Code construyendo un bot de gestión personal (no un LinkedIn post writer). Los niveles son: Nivel 0 (Chatbot) → Nivel 1 (Plan Mode) → Nivel 2 (CLAUDE.md) → Nivel 3 (Commands, Skills y Hooks) → Nivel 4 (MCP Servers) → Nivel 5 (GSD Framework) → Nivel 6 (Sub-agentes) → Nivel 7 (Flujos autónomos).
- [ ] **CONT-05**: El tiempo total de completado del tutorial (incluyendo setup) no excede 60 minutos para un usuario que ya tiene Claude Code instalado.

### CERT — Certificado y Sharing

- [ ] **CERT-01**: Al completar los 7 niveles, el usuario accede a su certificado: imagen PNG personalizada con su nombre (de LinkedIn), los niveles completados, branding de ZalesMachine, y fecha.
- [ ] **CERT-02**: Existe una página pública de certificado en `/certificate/[userId]` con meta tags Open Graph correctos (`og:image` apuntando al endpoint de generación del PNG).
- [ ] **CERT-03**: El usuario puede descargar el PNG del certificado con un botón "Descargar certificado".
- [ ] **CERT-04**: La pantalla de completado incluye un botón "Compartir en LinkedIn" que abre el share dialog de LinkedIn con la URL del certificado pre-cargada.
- [ ] **CERT-05**: La pantalla de completado incluye un bloque de texto de post pre-escrito (copiable en 1 click) con el nombre del usuario ya incluido y un link al tutorial.

### LAND — Landing Page

- [ ] **LAND-01**: La landing page (pública, pre-registro) muestra: propuesta de valor clara (qué va a construir el usuario), tiempo estimado (~1 hora), logo y credibilidad de ZalesMachine.
- [ ] **LAND-02**: La landing page tiene un único CTA: botón "Comenzar con LinkedIn" que inicia el flujo de LinkedIn OAuth.
- [ ] **LAND-03**: Los usuarios autenticados que visitan la landing son redirigidos automáticamente a su nivel actual del tutorial.

---

## v2 Requirements (Diferidos)

- Counter de social proof en landing ("X personas completaron esto") — diferido hasta tener datos reales
- Estimación de tiempo por nivel en la card intro
- Card de intro "Qué vas a lograr" al inicio de cada nivel
- Fast-paths "ya tenés X instalado" en niveles de setup
- Logout explícito (la sesión expira en 30 días; no es bloqueante para v1)
- Analytics dashboard para el creador
- CTA de share a mitad del tutorial (Nivel 4)

---

## Out of Scope

- **Simulador de Claude Code en el browser** — contradice el propósito; el usuario usa Claude Code real en su propia máquina
- **LinkedIn post writer como proyecto del tutorial** — conflicto comercial (el creador vende un producto similar)
- **Múltiples paths / branching** — el tutorial es estrictamente lineal
- **Verificación automática de pasos** — requiere agente local; auto-atestación es suficiente
- **Email/password registration** — solo LinkedIn OAuth en v1
- **Gamificación avanzada** (rankings, puntos, leaderboards)
- **Videos embebidos en el tutorial** — texto + screenshots es suficiente; video solo en landing si se decide
- **Quiz/evaluaciones** — el bot funcionando es la evaluación
- **Notificaciones o email drip** — fuera de scope del tutorial en sí
- **Dark mode** — v2+

---

## Traceability

*(Completado por el roadmapper)*

| REQ-ID | Fase |
|--------|------|
| AUTH-01, AUTH-02, AUTH-03 | — |
| TUTO-01, TUTO-02, TUTO-03, TUTO-04, TUTO-05, TUTO-06 | — |
| CONT-01, CONT-02, CONT-03, CONT-04, CONT-05 | — |
| CERT-01, CERT-02, CERT-03, CERT-04, CERT-05 | — |
| LAND-01, LAND-02, LAND-03 | — |

---

*Definido: 2026-04-02 | Stack: Next.js 15 + Auth.js v5 + Neon + next/og + Vercel*
