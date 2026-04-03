# Phase 4: Certificate + Sharing — Research

**Researched:** 2026-04-03
**Domain:** Next.js OG image generation, Open Graph meta tags, LinkedIn sharing, Clipboard API
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CERT-01 | Personalized PNG certificate with user name, levels completed, ZalesMachine branding, and completion date | `next/og` ImageResponse route handler at `/api/certificate/[userId]/route.ts`; user data from `users` + `progress` DB tables |
| CERT-02 | Public `/certificate/[userId]` page with correct `og:image`, `og:title`, `og:description` meta tags | `generateMetadata` in `app/certificate/[userId]/page.tsx`; og:image points to the `/api/certificate/[userId]` route handler |
| CERT-03 | "Descargar certificado" button downloads PNG without opening new tab | Client-side `fetch` + `URL.createObjectURL` + programmatic `<a download>` click |
| CERT-04 | "Compartir en LinkedIn" opens LinkedIn share dialog with certificate URL pre-populated | `https://www.linkedin.com/sharing/share-offsite/?url={encodedCertUrl}` opened via `window.open` |
| CERT-05 | Pre-written post text block with user name + tutorial URL, copies to clipboard in one click | `navigator.clipboard.writeText()` with fallback; no external library needed |
</phase_requirements>

---

## Summary

Phase 4 adds certificate generation and sharing mechanics to close the viral loop. The core technical work is a Next.js Route Handler that uses `next/og`'s `ImageResponse` to render a PNG certificate from JSX+CSS at request time. A public `/certificate/[userId]` page uses `generateMetadata` to inject correct Open Graph tags so LinkedIn's crawler sees a proper preview image. The "Descargar" button uses a client-side fetch-to-blob-download pattern to avoid new tabs. LinkedIn sharing requires a single URL: `https://www.linkedin.com/sharing/share-offsite/?url=...`. Clipboard copy uses the native Clipboard API with no additional packages.

All five certificate requirements map cleanly onto Next.js 16.2.2 primitives that are already bundled — no new production dependencies are needed. The only addition is a TTF font file (for `ImageResponse` custom typography) and a server action or query function to fetch user + progress data for the certificate.

**Primary recommendation:** Use `next/og`'s `ImageResponse` in a Route Handler (`app/api/certificate/[userId]/route.ts`) as the single source of the certificate PNG. The public certificate page consumes this URL in both the `<img>` tag and the `og:image` meta tag, keeping the image generation logic in one place.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/og` (ImageResponse) | bundled in Next.js 16.2.2 | Server-side PNG generation from JSX | Zero extra dependency; uses Satori + Resvg internally; officially documented |
| `next` generateMetadata | 16.2.2 | Dynamic OG meta tags on the certificate page | App Router standard; automatically injects `<head>` tags |
| Clipboard API | Browser native | Copy post text to clipboard | No library needed; supported in all modern browsers |
| drizzle-orm | 0.45.2 (already installed) | Query user + progress data for certificate | Already in project; consistent with existing DB layer |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TTF font file (Inter or similar) | System / fetched at build | Custom typography in ImageResponse | ImageResponse only supports ttf/otf/woff; ttf preferred |
| `URL.createObjectURL` | Browser native | Convert fetch response to downloadable blob | Needed for the "download without new tab" pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/og` ImageResponse | `sharp` + `canvas` / `node-canvas` | Sharp is a binary dependency requiring native builds; canvas is heavier; ImageResponse is already bundled and Vercel-optimized |
| `next/og` ImageResponse | `puppeteer` screenshot | Puppeteer is 300MB+, overkill for a static-layout certificate |
| `navigator.clipboard` | `clipboard.js` library | Library adds 2KB for no benefit; native API works everywhere relevant |

**Installation:** No new production dependencies required. A TTF font file must be added to `public/fonts/` or fetched from a CDN at runtime inside the Route Handler.

**Version verification:** `next` 16.2.2 bundles `@vercel/og` (satori 0.26.0, resvg 0.34.5) — confirmed via `node_modules/next/dist/compiled/@vercel/og/`. These are already on disk.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── certificate/
│   │       └── [userId]/
│   │           └── route.ts          # GET → ImageResponse PNG
│   ├── certificate/
│   │   └── [userId]/
│   │       └── page.tsx              # Public page + generateMetadata
│   └── tutorial/
│       └── [level]/
│           └── page.tsx              # (existing) — AchievementOverlay "Ver mi certificado" links here
├── components/
│   ├── certificate/
│   │   ├── CertificatePage.tsx       # Client component: download + share + copy buttons
│   │   └── __tests__/
│   │       └── CertificatePage.test.tsx
│   └── tutorial/
│       └── AchievementOverlay.tsx    # (existing) — "Ver mi certificado" navigates to /certificate/[userId]
├── lib/
│   └── certificate.ts                # getUserForCertificate(userId) query helper
└── db/
    └── schema.ts                     # (existing) — no schema changes needed
```

### Pattern 1: Route Handler PNG Generation

**What:** A `GET` route handler at `/api/certificate/[userId]` that queries the DB, renders an `ImageResponse`, and returns `image/png`.

**When to use:** Any time a dynamic image must be generated per-user. The same URL serves both the `og:image` meta tag and the download button.

**Example:**
```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/image-response.md
// app/api/certificate/[userId]/route.ts
import { ImageResponse } from 'next/og';
import { db } from '@/db';
import { users, progress } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const [user] = await db
    .select({ name: users.name, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return new Response('Not found', { status: 404 });

  const completionDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171717',
          padding: '60px',
        }}
      >
        {/* ZalesMachine branding, user name, date */}
        <div style={{ fontSize: 48, color: '#D9ADFF', fontWeight: 700 }}>
          {user.name}
        </div>
        <div style={{ fontSize: 24, color: '#E9FFB9', marginTop: 24 }}>
          {completionDate}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### Pattern 2: Dynamic Open Graph Meta Tags

**What:** Export `generateMetadata` from the certificate page Server Component. The `og:image` URL points to the Route Handler above.

**When to use:** Any public page where the OG image must be personalized per-user at request time.

**Example:**
```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
// app/certificate/[userId]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ userId: string }> }
): Promise<Metadata> {
  const { userId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  return {
    title: 'Certificado — Claude Code Mastery',
    description: 'Completé el tutorial de Claude Code de ZalesMachine.',
    openGraph: {
      title: 'Completé el tutorial de Claude Code',
      description: 'Aprendí a construir un bot de gestión personal con Claude Code.',
      url: `${baseUrl}/certificate/${userId}`,
      images: [
        {
          url: `${baseUrl}/api/certificate/${userId}`,
          width: 1200,
          height: 630,
          alt: 'Certificado de Claude Code Mastery',
        },
      ],
    },
  };
}
```

### Pattern 3: Client-Side PNG Download (No New Tab)

**What:** Fetch the image endpoint, convert to a Blob URL, click a hidden `<a download>` element programmatically.

**When to use:** Any file download that must stay in the same tab and avoid the browser's default "open in new tab" behavior for image URLs.

**Example:**
```typescript
// Source: MDN Web Docs — URL.createObjectURL / anchor download attribute
async function handleDownload(userId: string) {
  const res = await fetch(`/api/certificate/${userId}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'certificado-claude-code.png';
  a.click();
  URL.revokeObjectURL(url);
}
```

### Pattern 4: LinkedIn Share URL

**What:** Open LinkedIn's share dialog by navigating to `https://www.linkedin.com/sharing/share-offsite/?url={encodedUrl}`.

**When to use:** Any "Share on LinkedIn" button. This endpoint is the current standard (replaces the legacy `shareArticle` endpoint).

**Example:**
```typescript
// Source: https://www.linkedin.com/sharing/share-offsite/?url=  (confirmed active endpoint, 2025)
function handleLinkedInShare(certificateUrl: string) {
  const encoded = encodeURIComponent(certificateUrl);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    '_blank',
    'noopener,noreferrer,width=600,height=600'
  );
}
```

### Pattern 5: Clipboard Copy

**What:** Use `navigator.clipboard.writeText()` with a success/error state to give feedback.

**Example:**
```typescript
// Source: MDN Web Docs — Clipboard API
async function handleCopy(text: string, setCopied: (v: boolean) => void) {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    // Clipboard API not available (rare in modern browsers over HTTPS)
  }
}
```

### Anti-Patterns to Avoid
- **Using `window.open(imageUrl)` for download:** This opens the PNG in a new tab instead of downloading. Always use fetch + createObjectURL + `<a download>`.
- **Hardcoding the base URL inside the Route Handler for `og:image`:** The `og:image` URL must be absolute. Use `NEXT_PUBLIC_BASE_URL` env var or derive from request headers. Never hardcode `localhost`.
- **Placing `'use client'` on the certificate page itself:** `generateMetadata` only works in Server Components. Split into a Server Component page wrapper and a Client Component for interactive buttons.
- **Using `display: grid` in ImageResponse JSX:** Satori only supports flexbox + a subset of CSS. Grid layouts will silently fail or error.
- **Storing completion date outside of the DB:** The `progress.updatedAt` timestamp is the canonical completion timestamp. Do not generate the date client-side in the certificate.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG generation from HTML/CSS | Canvas rendering pipeline, node-canvas bindings | `next/og` ImageResponse | ImageResponse is already bundled; canvas needs native binaries and is fragile on Vercel |
| OG meta tag injection | Manual `<Head>` manipulation | `generateMetadata` export | App Router standard; Next.js injects tags correctly, including handling absolute URL resolution |
| Social share dialog | Custom OAuth share flow | LinkedIn `share-offsite` URL | The URL-based share dialog requires zero OAuth, zero LinkedIn Developer App approval |
| Clipboard copy with fallback | `document.execCommand('copy')` | `navigator.clipboard.writeText()` | `execCommand` is deprecated; native Clipboard API is universally available over HTTPS |

**Key insight:** Every certificate feature maps to a browser or Next.js primitive. The only custom code is the certificate layout (JSX inside ImageResponse) and the DB query that feeds it.

---

## Common Pitfalls

### Pitfall 1: og:image Must Be an Absolute URL
**What goes wrong:** Setting `og:image` to a relative path like `/api/certificate/123`. LinkedIn's crawler cannot resolve relative URLs and the preview image fails silently.
**Why it happens:** `generateMetadata` accepts relative paths for local assets but OG image crawlers fetch from the outside.
**How to avoid:** Always construct the `og:image` value as a full absolute URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/certificate/${userId}`. Set `NEXT_PUBLIC_BASE_URL` in `.env.local` and in Vercel env vars.
**Warning signs:** LinkedIn Post Inspector shows the og:image tag present but preview image does not render.

### Pitfall 2: ImageResponse CSS Subset Limitations
**What goes wrong:** Using `display: grid`, `gap`, `border-radius` on non-flex containers, or CSS variables (`var(--brand-primary)`) inside the JSX passed to ImageResponse.
**Why it happens:** Satori (the rendering engine under `next/og`) implements a CSS subset — flexbox only, no grid, no CSS custom properties.
**How to avoid:** Use only inline styles with literal hex color values. Use `display: 'flex'` exclusively. Refer to Satori's supported CSS list before designing the certificate layout.
**Warning signs:** ImageResponse throws at runtime, or the image renders with missing/broken layout.

### Pitfall 3: No TTF Font = System Default Font in PNG
**What goes wrong:** ImageResponse falls back to a built-in sans-serif that may not match ZalesMachine brand typography.
**Why it happens:** ImageResponse does not use the project's Tailwind/CSS fonts — those are browser-side. The font must be explicitly loaded as an `ArrayBuffer` in the Route Handler.
**How to avoid:** Place a TTF file in `public/fonts/` and read it with `import { readFile } from 'node:fs/promises'` + `join(process.cwd(), 'public/fonts/...')` inside the Route Handler.
**Warning signs:** Certificate PNG renders with wrong or inconsistent font weight.

### Pitfall 4: AchievementOverlay Navigation to Certificate
**What goes wrong:** Clicking "Ver mi certificado" in AchievementOverlay navigates to `/certificate/undefined` because the userId is not available inside the client component.
**Why it happens:** The `useProgress` hook tracks progress but not the user UUID. The sessionId (in localStorage) must be exchanged for the userId server-side.
**How to avoid:** Either (a) store the userId in localStorage at registration time (alongside sessionId), or (b) add a server action `getUserIdBySessionId(sessionId)` that resolves before navigation. Option (a) is simpler and consistent with existing session patterns.
**Warning signs:** Certificate page loads with a 404 or shows empty data.

### Pitfall 5: LinkedIn Crawler Cannot Authenticate
**What goes wrong:** The `/certificate/[userId]` page is protected by `SessionGuard` and returns a redirect to the landing page for unauthenticated visitors (including LinkedIn's crawler).
**Why it happens:** The existing `SessionGuard` component checks localStorage for a sessionId — which crawlers don't have.
**How to avoid:** The `/certificate/[userId]` route must be fully public (no SessionGuard). The data shown is intentionally public (user chose to share). The API route at `/api/certificate/[userId]` must also be unauthenticated.
**Warning signs:** LinkedIn Post Inspector returns a redirect or 401 instead of the certificate page HTML.

### Pitfall 6: `progress.updatedAt` vs. Actual Completion Date
**What goes wrong:** `progress.updatedAt` gets updated every time any step is completed, not just on final completion. Using it as the "completion date" on the certificate is misleading.
**Why it happens:** The `saveProgress` action upserts with `updatedAt: new Date()` on every call.
**How to avoid:** When the final level completes (all 7 levels in `completedLevels`), add a `completedAt` column to the `progress` table (nullable timestamp, set once) — OR use `progress.updatedAt` as a reasonable proxy and document that it's the last-updated date. The simpler v1 approach is to store `completedAt: new Date().toISOString()` in the `TutorialProgress` JSON blob itself (already typed as `jsonb`) without a DB migration.
**Warning signs:** Certificate shows wrong date for users who completed the tutorial then came back.

---

## Data Available for Certificate Generation

From the existing schema and progress data:

| Data Point | Source | Notes |
|------------|--------|-------|
| User's name | `users.name` | Entered at registration (e.g., "Nicolás Kwiatkowski") |
| LinkedIn URL | `users.linkedinUrl` | Could be shown as secondary info |
| Registration date | `users.createdAt` | Available but not relevant for certificate |
| Completed levels | `progress.data.completedLevels` | Array of ints, e.g. `[0,1,2,3,4,5,6]` |
| Current level | `progress.data.currentLevel` | Must be 7 for all levels complete |
| Completion date | `progress.updatedAt` OR new `completedAt` field in JSONB | See Pitfall 6 |

**No schema migration required** if completion date is stored in the existing JSONB `data` column. The `TutorialProgress` type just needs a `completedAt?: string` field added.

---

## LinkedIn Sharing Details

### Share Dialog URL (CONFIRMED ACTIVE, 2025)
```
https://www.linkedin.com/sharing/share-offsite/?url={encodedCertificateUrl}
```
- Only `url` is required. LinkedIn reads `og:title` and `og:description` from the page automatically.
- No API key, no OAuth, no LinkedIn Developer App required.
- Open with `window.open(..., '_blank', 'noopener,noreferrer,width=600,height=600')`.

### Legacy endpoint (DO NOT USE)
`https://www.linkedin.com/shareArticle?mini=true&url=...` — documented but widely reported broken.

### og:image Requirements for LinkedIn
- **Minimum dimensions:** 1200 × 627 px (1.91:1 ratio)
- **Maximum file size:** 5 MB
- **Format:** PNG or JPEG
- **Must be absolute URL** accessible without authentication
- Images under 401 px wide show as thumbnails only

ImageResponse defaults (1200 × 630) satisfy these requirements.

---

## Code Examples

### Verified: Query user + progress for certificate
```typescript
// Source: existing src/app/actions/progress.ts pattern + drizzle-orm 0.45.x
import { db } from '@/db';
import { users, progress } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserForCertificate(userId: string) {
  const [result] = await db
    .select({
      name: users.name,
      linkedinUrl: users.linkedinUrl,
      createdAt: users.createdAt,
      progressData: progress.data,
      progressUpdatedAt: progress.updatedAt,
    })
    .from(users)
    .leftJoin(progress, eq(progress.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  return result ?? null;
}
```

### Verified: params in Next.js 16.x route handlers use Promise
```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// Source: existing src/app/tutorial/[level]/page.tsx pattern
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  // ...
}
```

### Verified: generateMetadata with dynamic params
```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
export async function generateMetadata(
  { params }: { params: Promise<{ userId: string }> }
): Promise<Metadata> {
  const { userId } = await params;
  // ...
}
```

---

## Existing Codebase Integration Points

### Where Certificate Navigation Is Already Wired
`AchievementOverlay.tsx` already shows "Ver mi certificado" button when `level >= TOTAL_LEVELS - 1` (level 6). The `onNavigate` callback in `LevelPage.tsx` currently calls `router.push('/tutorial/${level + 1}')`. This must be changed to `router.push('/certificate/${userId}')` when on the final level.

**The userId is not currently available in LevelPage.** The simplest fix: store userId in localStorage at registration time (alongside sessionId) and read it in LevelPage when navigating on final level completion.

### Where to Add userId to localStorage
`src/app/actions/actions.ts` → `registerUser` already creates the user and returns `sessionId`. The response can include `userId` as well, and `RegistrationForm.tsx` can call `setUserId(userId)` in localStorage.

### Completion Trigger
The certificate is shown when all 7 levels are in `progress.completedLevels`. The check `completedLevels.length === TOTAL_LEVELS` (7) is sufficient.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/og` as separate package | Bundled in `next/og` | Next.js 14.0 | Zero extra install; always matches Next version |
| `shareArticle?mini=true` LinkedIn URL | `sharing/share-offsite/?url=` | ~2021 | More reliable; same one-click UX |
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | Standardized 2017, universally available ~2020 | No library needed |

---

## Open Questions

1. **Certificate design / branding assets**
   - What we know: Brand tokens are defined (`#D9ADFF`, `#70B5FF`, `#E9FFB9`, `#171717`). No logo SVG or PNG has been found in `public/`.
   - What's unclear: Does ZalesMachine have a logo file to embed in the certificate? ImageResponse supports `<img>` tags with absolute URLs.
   - Recommendation: Treat the certificate design as a task in the plan. If no logo asset exists, use a text wordmark styled with brand colors inside the ImageResponse JSX.

2. **userId stored in localStorage?**
   - What we know: Currently only `sessionId` is stored. The certificate page needs the userId UUID in the URL.
   - What's unclear: Whether storing userId alongside sessionId is acceptable, or if a server round-trip to resolve sessionId → userId is preferred.
   - Recommendation: Store userId in localStorage at registration (Phase 1 already stores sessionId; adding userId is a one-line change). This avoids an extra server action and is consistent with the existing pattern.

3. **completedAt timestamp**
   - What we know: `progress.updatedAt` is not a reliable completion date. The JSONB `data` column can absorb a `completedAt?: string` field without migration.
   - What's unclear: Whether the creator wants a precise completion date or a best-effort date.
   - Recommendation: Add `completedAt?: string` to `TutorialProgress` type (ISO string, set once when `completedLevels.length === TOTAL_LEVELS`). No DB migration needed.

---

## Environment Availability

Step 2.6: SKIPPED (no external tool dependencies — all capabilities are bundled in Next.js or are browser APIs).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npm test -- --reporter=verbose src/components/__tests__/CertificatePage.test.tsx` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CERT-01 | Route handler returns 200 + `image/png` content-type | unit (mocked DB) | `npm test -- src/app/api/certificate` | ❌ Wave 0 |
| CERT-01 | Certificate includes user name in rendered output | unit (ImageResponse mock) | `npm test -- src/app/api/certificate` | ❌ Wave 0 |
| CERT-02 | `generateMetadata` returns og:image URL matching pattern | unit | `npm test -- src/app/certificate` | ❌ Wave 0 |
| CERT-02 | og:image URL is absolute (starts with http) | unit | `npm test -- src/app/certificate` | ❌ Wave 0 |
| CERT-03 | "Descargar certificado" button triggers fetch + blob download | unit (mock fetch) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ Wave 0 |
| CERT-04 | "Compartir en LinkedIn" calls window.open with correct URL | unit (mock window.open) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ Wave 0 |
| CERT-05 | Copy button calls navigator.clipboard.writeText with expected text | unit (mock clipboard) | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ Wave 0 |
| CERT-05 | Post text includes user name and tutorial URL | unit | `npm test -- src/components/__tests__/CertificatePage.test.tsx` | ❌ Wave 0 |

**Manual-only (no automation):**
- LinkedIn Post Inspector validation (external tool, requires deployed URL)
- Visual review of certificate PNG layout and branding

### Sampling Rate
- **Per task commit:** `npm test -- src/components/__tests__/CertificatePage.test.tsx`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/app/api/certificate/[userId]/__tests__/route.test.ts` — covers CERT-01
- [ ] `src/app/certificate/[userId]/__tests__/page.test.ts` — covers CERT-02
- [ ] `src/components/__tests__/CertificatePage.test.tsx` — covers CERT-03, CERT-04, CERT-05
- [ ] `src/lib/__tests__/certificate.test.ts` — covers getUserForCertificate query helper

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/image-response.md` — ImageResponse API, supported CSS, font loading
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — generateMetadata, openGraph fields, absolute URL requirement
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` — Route Handler signature, params as Promise
- `node_modules/next/dist/compiled/@vercel/og/` — confirms @vercel/og is bundled (satori 0.26.0, resvg 0.34.5)
- `src/db/schema.ts` — confirmed available user fields (name, linkedinUrl, createdAt), progress fields
- `src/components/tutorial/AchievementOverlay.tsx` — confirmed "Ver mi certificado" button exists at final level

### Secondary (MEDIUM confidence)
- [LinkedIn Help: Make your website shareable](https://www.linkedin.com/help/linkedin/answer/a521928) — og:image minimum 1200×627, max 5MB, must be absolute URL
- [LinkedIn sharing/share-offsite endpoint](https://www.linkedin.com/sharing/share-offsite/?url=) — confirmed active endpoint (2025), `url` parameter required
- [LinkedIn Consumer: Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin) — UGC API docs; confirms no OAuth needed for URL-based share dialog

### Tertiary (LOW confidence)
- WebSearch consensus: `shareArticle?mini=true` is widely reported unreliable; `sharing/share-offsite` is the current standard — not officially documented as the replacement but confirmed by multiple community sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified in node_modules; no new dependencies
- Architecture: HIGH — patterns verified against bundled Next.js 16.2.2 docs
- LinkedIn sharing URL: MEDIUM — active endpoint confirmed, but LinkedIn does not formally document it as the canonical replacement
- Pitfalls: HIGH — derived from actual codebase analysis (no SessionGuard on certificate route, userId missing from localStorage, Satori CSS subset)

**Research date:** 2026-04-03
**Valid until:** 2026-07-03 (stable Next.js APIs; 30-day validity for LinkedIn URL format)
