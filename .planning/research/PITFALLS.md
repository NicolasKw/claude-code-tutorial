# Pitfalls Research — Claude Code Tutorial Lead Magnet

**Investigado:** 2026-04-02
**16 pitfalls identificados — 7 críticos, 5 moderados, 4 menores**

---

## Críticos

### 1. LinkedIn OIDC requiere aprobación manual del producto
**Pitfall:** "Sign In with LinkedIn using OpenID Connect" no se activa automáticamente al crear la app. Los scopes `openid profile email` solo funcionan después de agregar el producto manualmente en el LinkedIn Developer Portal. Este proceso puede tardar 1-3 días hábiles.

**Señal de alerta:** Error `invalid_scope` o `unauthorized_client` en el flujo de OAuth.

**Prevención:** Crear la LinkedIn Developer App en Fase 1 (auth), solicitar el producto inmediatamente, y no bloquear otras fases en esto. Tener un mock de LinkedIn para desarrollo local.

**Fase:** Fase de Auth (primera).

---

### 2. Las URLs de fotos de perfil de LinkedIn son efímeras
**Pitfall:** Las URLs de fotos de perfil que LinkedIn devuelve en el token OIDC son CDN URLs firmadas con tiempo de expiración. Guardarlas en la DB como strings hace que las fotos en los badges se rompan en días o semanas.

**Señal de alerta:** Imágenes rotas en certificados de usuarios que completaron el tutorial hace más de 48 horas.

**Prevención:** No guardar la URL de la foto directamente. Opciones: (a) descargar y re-hostear la foto en el momento del registro, (b) no usar la foto del usuario en el badge — solo el nombre, (c) regenerar la foto en cada renderizado del badge haciendo fetch fresh desde LinkedIn (requiere token válido).

**Recomendación:** Opción (b) para v1 — el badge usa nombre + diseño propio del creador, sin foto del usuario. Más simple, más confiable.

**Fase:** Fase de Auth + Badge generation.

---

### 3. El authorization code de LinkedIn expira en 30 minutos y el redirect URI debe coincidir exactamente
**Pitfall:** Un trailing slash diferente entre el redirect URI registrado y el usado en el código mata el flujo OAuth silenciosamente. Errores difíciles de debuggear en producción.

**Señal de alerta:** Error `redirect_uri_mismatch` en el callback de OAuth.

**Prevención:** Registrar EXACTAMENTE el mismo redirect URI en el Developer Portal y en el código (incluyendo o excluyendo trailing slash consistentemente). Documentar esto en `.env.example`.

**Fase:** Fase de Auth.

---

### 4. Cambiar scopes después del launch invalida todos los tokens existentes
**Pitfall:** Si se agregan scopes nuevos a la app de LinkedIn después de que usuarios ya se registraron, todos los tokens existentes quedan inválidos y todos los usuarios deben re-autenticarse.

**Señal de alerta:** Errores de token inválido masivos después de un cambio de config.

**Prevención:** Definir los scopes finales antes del primer usuario real. No iterar scopes en producción.

**Fase:** Planificación pre-launch.

---

### 5. El registration gate antes de mostrar valor mata la conversión de tráfico frío
**Pitfall:** Si el landing page solo muestra un botón de "Login con LinkedIn" sin explicar qué obtendrá el usuario, la tasa de conversión cae drásticamente. Los usuarios de tráfico frío (que llegan desde el post de LinkedIn por primera vez) no tienen contexto.

**Señal de alerta:** Alta tasa de rebote en la landing page; pocos registros relativo a visitas.

**Prevención:** El landing page debe mostrar ANTES del CTA de login: (1) qué van a construir, (2) cuánto tarda (~1 hora), (3) social proof. El botón de LinkedIn es el único CTA, pero aparece después de la propuesta de valor.

**Fase:** Fase de Landing/UX.

---

### 6. Canvas-based badge generation falla con imágenes cross-origin
**Pitfall:** Si se genera el badge en el cliente usando Canvas API, llamar a `toDataURL()` después de dibujar una imagen de un origen diferente (ej: una foto de LinkedIn o cualquier imagen externa) lanza `SecurityError: Tainted canvas`. El badge no se puede exportar.

**Señal de alerta:** Error en la consola del browser al intentar descargar el badge.

**Prevención:** Generar el badge en el servidor con `next/og` (ImageResponse). Todas las imágenes se cargan server-side sin restricciones CORS. Alternativa: no incluir imágenes externas en el badge.

**Fase:** Fase de Badge generation.

---

### 7. Progreso guardado solo en localStorage se pierde al cambiar de browser o dispositivo
**Pitfall:** Si el progreso se guarda en `localStorage`, el usuario que empieza en el trabajo y quiere continuar en casa encuentra el tutorial desde cero. Tasa de completado cae.

**Señal de alerta:** Muchos usuarios en el analytics con progreso = 0 a pesar de haber visitado antes.

**Prevención:** Guardar progreso en la DB (Neon) ligado al LinkedIn user ID desde el primer nivel completado. `localStorage` puede usarse como cache optimista pero no como fuente de verdad.

**Fase:** Fase de Progress infrastructure.

---

## Moderados

### 8. Tutorial sin checkpoints de acción falla con audiencia no-técnica
**Pitfall:** Si cada nivel es solo texto explicativo sin un momento claro de "ahora vos hacés X", los no-técnicos no saben cuándo actuar y cuándo seguir leyendo. Abandonan por confusión, no por dificultad.

**Prevención:** Cada paso dentro de un nivel debe terminar con exactamente una acción y un botón de confirmación ("Listo, ya lo hice"). El texto explicativo va después de la acción, no antes.

**Fase:** Fase de Tutorial content.

---

### 9. Los requisitos de instalación pueden consumir todo el presupuesto de 1 hora
**Pitfall:** Si el Nivel 0 o Nivel 1 requiere instalar Node.js, Claude Code CLI, configurar API keys, etc., usuarios sin el entorno setup consumen toda la hora solo en prerequisitos y nunca llegan a los conceptos reales.

**Prevención:** (a) Comunicar claramente los prerequisitos en la landing page ANTES del registro ("Necesitás tener X instalado"), (b) hacer el Nivel 0 un chequeo rápido de prerequisitos con links a guías, (c) estimar el tiempo de setup realísticamente y ajustar el tiempo total prometido.

**Fase:** Fase de Tutorial content (Nivel 0).

---

### 10. LinkedIn share URL vs UGC API — el simple URL cubre el 95% de casos
**Pitfall:** La API de UGC Posts de LinkedIn (para postear programáticamente) requiere acceso de Partner Program y es extremadamente difícil de obtener. Muchos proyectos pierden semanas intentando obtener acceso API para algo que un simple URL de share resuelve.

**Prevención:** Usar `https://www.linkedin.com/sharing/share-offsite/?url=[url-del-certificado]` — abre el share dialog de LinkedIn con la URL pre-cargada, LinkedIn fetcha el og:image automáticamente. El usuario copia el texto pre-escrito y lo pega. No se necesita API.

**Fase:** Fase de Sharing mechanics.

---

### 11. El contenido del tutorial se vuelve obsoleto a medida que Claude Code evoluciona
**Pitfall:** Claude Code cambia frecuentemente (comandos, flags, outputs). Si los comandos están hardcodeados en el contenido del tutorial, se vuelven incorrectos rápidamente y dañan la credibilidad del creador.

**Prevención:** Centralizar los comandos y versiones en un archivo de config (`content/config.ts`) importado por todos los niveles. Cuando cambia un comando, se actualiza en un solo lugar. Usar capturas de pantalla con fecha clara para que los usuarios entiendan que el output visual puede variar.

**Fase:** Fase de Tutorial content.

---

### 12. Access token de LinkedIn en localStorage — exposición de seguridad
**Pitfall:** Auth.js maneja los tokens correctamente (en cookies httpOnly), pero si en algún paso del desarrollo se guarda el token en localStorage para debugging, queda expuesto a XSS.

**Prevención:** Usar Auth.js v5 con su manejo de sesiones por defecto (JWT en cookie httpOnly). Nunca guardar tokens en localStorage ni en variables globales del cliente.

**Fase:** Fase de Auth.

---

## Menores

### 13. CORS faltante en API routes
**Pitfall:** Las API routes de Next.js no configuran CORS por defecto. Si en el futuro se quiere consumir las APIs desde otro origen (ej: una app móvil o un iframe), van a fallar.

**Prevención:** Para v1 (mismo origen), no es necesario configurar CORS. Documentar que es intencionalmente same-origin.

**Fase:** No urgente — documentar como limitación conocida.

---

### 14. LinkedIn app en Development Mode bloquea usuarios reales
**Pitfall:** Las apps de LinkedIn en modo Development solo permiten el login de usuarios listados como testers en el Developer Portal. Si se lanza el tutorial sin mover la app a producción, los usuarios reales ven un error de acceso.

**Señal de alerta:** Usuarios reportando que no pueden hacer login con LinkedIn.

**Prevención:** Verificar el proceso de revisión de la app de LinkedIn ANTES del launch. Mover a producción requiere una revisión adicional de LinkedIn que puede tomar días.

**Fase:** Pre-launch checklist.

---

### 15. Badge sin URL única rompe el loop viral
**Pitfall:** Si el badge/certificado no tiene una URL pública y estable (`/certificate/[userId]`), no se puede generar un link compartible. El usuario puede descargar la imagen pero LinkedIn no puede previsualizar el og:image.

**Prevención:** Cada usuario tiene una página de certificado pública en `/certificate/[userId]`. Esta página tiene los meta tags de Open Graph correctos. El botón de share apunta a esta URL.

**Fase:** Fase de Badge/Certificate.

---

### 16. El campo email de LinkedIn es opcional — puede estar ausente
**Pitfall:** El scope `email` en el OIDC de LinkedIn devuelve el email solo si el usuario tiene uno verificado y decidió compartirlo. Si el código asume que `email` siempre existe, hay crashes en registro.

**Señal de alerta:** Errores 500 en el callback de OAuth para ciertos usuarios.

**Prevención:** Hacer `email` nullable en el schema de DB. En el código, manejar el caso `email === null` o `email === undefined` en el callback de Auth.js. No requerir email para completar el registro.

**Fase:** Fase de Auth.

---

## Pre-Launch Checklist (síntesis de pitfalls críticos)

- [ ] LinkedIn Developer App creada y producto OIDC aprobado
- [ ] Redirect URIs verificados (exactamente iguales en portal y en código)
- [ ] Scopes finales definidos antes del primer usuario real
- [ ] App movida de Development Mode a producción
- [ ] Badge generado server-side (no canvas client-side)
- [ ] Progreso guardado en DB (no localStorage)
- [ ] Email de LinkedIn manejado como nullable
- [ ] Prerequisitos del tutorial comunicados antes del registro
- [ ] URL de certificado pública con og:image meta tag correcto

*Research completed: 2026-04-02*
