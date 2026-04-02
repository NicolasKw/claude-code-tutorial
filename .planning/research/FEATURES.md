# Feature Landscape — Claude Code Tutorial Lead Magnet

**Domain:** Interactive tutorial lead magnet — single-use, guided, ~1 hora, audiencia no-técnica
**Proyecto:** Claude Code Mastery (7 niveles, construir un bot de gestión personal)
**Audiencia:** Dueños de negocio hispanohablantes, llegan desde LinkedIn
**Objetivo lead magnet:** Capturar lead (perfil LinkedIn), entregar valor, generar shares en LinkedIn
**Investigado:** 2026-04-02

---

## Table Stakes

Features que los usuarios esperan. Sin ellas = abandonan o no convierten.

| Feature | Por qué se espera | Complejidad | Notas |
|---------|-------------------|-------------|-------|
| **Registration gate antes del contenido** | Los usuarios esperan identificarse antes de acceder a un tutorial; también es el momento de captura del lead | Baja | Debe ser sin fricción — LinkedIn OAuth es 1 click, crítico para audiencia no-técnica |
| **Propuesta de valor clara antes del registro** | El usuario necesita saber qué obtiene antes de dar sus datos | Baja | Landing con beneficio concreto, tiempo estimado ("~1 hora") y qué van a construir |
| **Progresión lineal paso a paso** | El formato tutorial implica guía; los no-técnicos necesitan una cosa a la vez | Baja | Un paso visible a la vez con acción explícita de "Siguiente" |
| **Indicador de progreso** | Los usuarios necesitan orientación ("¿cuánto falta?") para comprometerse a terminar | Baja | Mostrar nivel/paso actual sobre total — "Nivel 3 de 7" — macro (niveles) y micro (pasos) |
| **Progreso persistente (reanudar)** | Las interrupciones son inevitables en un tutorial de 1 hora; perder el progreso causa abandono | Media | Guardar server-side ligado al user ID de LinkedIn; mostrar "Continuar donde quedaste" al volver |
| **Bloques de código copy-paste** | El usuario debe ejecutar comandos en su propia máquina; errores de tipeo matan el momentum | Baja | Bloques con botón de copia en 1 click; distinción visual clara del texto |
| **Distinción clara "qué hacés vos" vs "qué pasa en la app"** | El usuario ejecuta Claude Code localmente; el browser muestra instrucciones — la separación debe ser cristalina | Media | Label persistente ("En tu terminal:" / "En el browser:"); iconografía consistente |
| **Confirmación de paso completado** | Después de hacer algo en el terminal, el usuario necesita confirmarlo para avanzar | Baja | Botón "Listo, ya lo hice" o checkbox; sin verificación automática |
| **Legible en mobile** | Los usuarios lo revisarán en mobile aunque hagan el trabajo en desktop | Baja | Layout responsive; bloques de código con scroll horizontal en mobile |
| **Guía para errores comunes** | Los no-técnicos VAN a encontrar errores; sin fallback = abandonan | Media | Cada paso con errores probables listados: "Si ves este error, hacé esto" |
| **Feedback visual de nivel desbloqueado** | Completar un nivel se siente como un logro | Baja | Animación o cambio de estado visual al completar; siguiente nivel se desbloquea visualmente |
| **Personalización con nombre del usuario** | Un lead magnet que conoce tu nombre se siente premium | Baja | Mostrar "Hola [nombre de LinkedIn]" en header o intro de niveles; usar nombre en el certificado final |

---

## Differentiators

Features que hacen este tutorial memorable, compartible y distintivo.

| Feature | Propuesta de valor | Complejidad | Notas |
|---------|--------------------|-------------|-------|
| **Certificado personalizado descargable (imagen PNG)** | Prueba tangible de aprendizaje; gatillo principal del loop viral; la audiencia de LinkedIn responde fuerte a logros | Alta | Debe incluir: nombre completo (de LinkedIn), niveles alcanzados, proyecto construido, branding del creador, fecha. Debe verse profesional — certificado barato = no se comparte |
| **Texto de post LinkedIn pre-escrito** | Elimina la fricción entre "quiero compartir" y "realmente comparto"; la mayoría no va a componer desde cero | Baja | Texto pre-escrito por el creador, con nombre del usuario ya incluido y link al tutorial |
| **Botón de share en LinkedIn** | 1 click para el loop viral | Baja | `https://www.linkedin.com/sharing/share-offsite/?url=...` — no requiere API |
| **Resumen "qué construiste" al completar** | Cierra el loop, refuerza el valor y hace que el share se sienta ganado | Baja | Pantalla final listando el output concreto de cada nivel |
| **Framing de output práctico al inicio de cada nivel** | Los no-técnicos se motivan por resultados. "Al terminar este nivel, tu bot podrá hacer X" | Baja | Card intro por nivel con la capacidad concreta que se desbloquea |
| **Estimación de tiempo por nivel** | Reduce la ansiedad del compromiso | Baja | "Este nivel toma ~8 minutos" en la card intro de cada nivel |
| **Fast-path "ya tenés X instalado"** | Algunos usuarios ya tienen Node, Git o Claude Code; forzarlos a reinstalar es condescendiente | Media | Secciones colapsables "Si ya tenés X instalado, saltá al paso 3" en niveles de setup |
| **Presencia del creador** | Un lead magnet personal construye la relación de seguimiento | Baja | Foto del creador + intro breve en landing y en hitos clave; voz del creador en el texto |
| **Counter de social proof en landing** | "X personas ya completaron este tutorial" reduce la hesitación de nuevos visitantes | Baja | Counter simple en DB; mostrar solo en landing |

---

## Anti-Features

Features a NO construir en v1.

| Anti-Feature | Por qué evitar | Qué hacer en su lugar |
|--------------|----------------|----------------------|
| **Terminal en el browser / simulador de Claude Code** | Extremadamente complejo; desvirtúa el propósito (que usen Claude Code real) | Guiar al usuario a su terminal local con comandos copy-paste |
| **Verificación automática de pasos** | Requiere agente local o comunicación server desde la máquina del usuario — complejidad significativa | Auto-atestación ("Listo, ya lo hice") es suficiente |
| **Registro con email/password** | LinkedIn OAuth es estrictamente mejor: 1 click, datos de lead más ricos, personalización | Solo LinkedIn OAuth en v1 |
| **Leaderboards o sistemas de puntos** | Gestión de estado significativa; puede sentirse gimmicky en una app de un solo uso de 1 hora | Feedback visual de nivel desbloqueado es suficiente |
| **Múltiples paths / branching** | Complejidad de contenido y navegación; rompe la experiencia guiada | Solo path lineal |
| **Comentarios o comunidad** | Fuera de scope; crea carga de moderación | Link al LinkedIn del creador para preguntas |
| **Videos embebidos en el tutorial** | Aumenta dramáticamente el tiempo; difícil de hojear; el usuario pierde el lugar cambiando entre video y terminal | Texto + screenshots/GIFs; video solo en landing como hook |
| **Quiz/evaluaciones** | Crea estados de falla; los no-técnicos encuentran los quizzes ansiógenos | Completar es auto-atestado; el bot funcionando es la evaluación |
| **Notificaciones in-app o email drip** | Segundo sistema; fuera de scope | El creador hace el follow-up por LinkedIn |
| **Dark mode** | Trabajo CSS no trivial; no es un decision point para esta audiencia | Un solo tema en v1 |

---

## Flujo de Onboarding / Registro

**Flujo recomendado:**

1. **Landing page** (pre-auth, público)
   - Titular: qué va a construir el usuario, beneficio concreto
   - Tiempo de compromiso: "~1 hora"
   - Counter de social proof: "X personas ya completaron esto"
   - Foto del creador + declaración de credibilidad en 2 líneas
   - CTA único: "Comenzar el tutorial" → dispara LinkedIn OAuth

2. **Pantalla de consentimiento LinkedIn OAuth** (manejado por LinkedIn)
   - Scopes mínimos: `openid`, `profile`, `email`
   - NO pedir `w_member_social` — los usuarios lo rechazarán; usar el método de share URL

3. **Pantalla de bienvenida / Mapa de niveles** (post-auth, primera visita)
   - "¡Hola [nombre]!" greeting personalizado
   - Mapa de 7 niveles, todos bloqueados excepto el Nivel 1
   - Tiempo total estimado
   - CTA único: "Empezar el Nivel 1"

4. **Visita de regreso** (post-auth, usuario que vuelve)
   - Mostrar estado de progreso inmediatamente: "Quedaste en el Nivel 3, Paso 2"
   - CTA único: "Continuar"

---

## Mecánicas de Completado / Sharing

El evento de conversión del lead magnet es el share en LinkedIn. El certificado y el post pre-escrito son los drivers principales.

**Secuencia recomendada en la pantalla de completado:**

1. **Momento de celebración** — animación breve, "¡Completaste los 7 niveles!"
2. **Resumen de qué construiste** — lista con el output concreto de cada nivel
3. **Reveal del certificado** — imagen personalizada mostrada in-page (mostrarla primero, no solo ofrecer la descarga)
4. **Botón de descarga** — "Descargar tu certificado"
5. **Bloque de share LinkedIn** (CTA más prominente):
   - Texto de post pre-escrito en un textarea editable (el usuario puede personalizar antes de copiar)
   - Botón "Copiar texto del post"
   - Botón "Compartir en LinkedIn" (abre URL de share de LinkedIn en nueva pestaña)
6. **CTA de seguir al creador** — "Si te fue útil, seguime en LinkedIn" con link directo al perfil (secundario, debajo del share)

---

## Patrones de Display de Contenido

| Patrón | Caso de uso | Notas |
|--------|-------------|-------|
| **Lista de pasos numerados dentro de un nivel** | Navegación principal dentro del nivel | Mostrar paso actual prominentemente; atenuar/deshabilitar pasos futuros |
| **Bloque de código con botón de copia** | Comandos que el usuario debe ejecutar en su terminal | Fuente monospace, syntax highlighting para comandos de terminal, copia en 1 click |
| **Callout "¿Qué hace esto?"** | Explicar el POR QUÉ después del comando, no antes | Los no-técnicos hacen primero, entienden después — menos ansiedad |
| **Callout "Si ves un error"** | Estados de error anticipados | Colapsable; no saturar el path principal |
| **Screenshot o GIF** | Mostrar cómo se ve el éxito en el terminal | Especialmente importante para los primeros 2 niveles cuando el usuario no tiene baseline |
| **Card "Qué lograste"** | Resumen de completado del nivel | Aparece cuando el usuario hace click en "Completé este nivel"; antes de desbloquear el siguiente |

---

## Recomendación MVP

**Construir primero (launch blockers):**
1. LinkedIn OAuth + captura de lead
2. Progresión lineal nivel/paso con persistencia de progreso
3. Bloques de código copy-paste
4. Auto-atestación de paso completado ("Listo")
5. Feedback visual de nivel desbloqueado
6. Pantalla de completado con post LinkedIn pre-escrito + link de share
7. Certificado descargable (PNG, nombre + niveles completados)

**Construir segundo (alto impacto, baja complejidad):**
8. Fast-paths "ya tenés X instalado" en niveles de setup
9. Callouts de errores anticipados por paso
10. Estimación de tiempo por nivel
11. Counter de social proof en landing

**Diferir a v2:**
- CTA de share a mitad del tutorial
- Dashboard de analytics para el creador
- Cualquier gamificación más allá del unlock de niveles

*Research completed: 2026-04-02*
