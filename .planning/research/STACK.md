# Stack Research — Claude Code Tutorial Lead Magnet

## Framework

**Next.js 15 App Router + React 19 + TypeScript** (HIGH confidence)

- App Router enables API routes, server components, and `next/og` in one framework
- No need for a separate backend
- Vercel deployment is zero-config
- TypeScript eliminates runtime type errors in a solo project

**Do NOT use:**
- Vite + React SPA — no server-side API routes, complicates OAuth flow
- Remix — overkill, smaller ecosystem for this use case
- Astro — less React ecosystem support for auth/dynamic features

---

## Authentication — LinkedIn OAuth

**Auth.js v5 (formerly NextAuth)** with LinkedIn OIDC provider (HIGH confidence — verified from official Microsoft/LinkedIn docs)

### Key details:
- LinkedIn uses **OIDC**, not the legacy REST API. Scopes: `openid profile email`
- Returns: `sub`, `name`, `given_name`, `family_name`, `picture`, `email`
- Requires activating **"Sign in with LinkedIn using OpenID Connect"** product in LinkedIn Developer Portal — this is a **manual approval step**, can take 1-3 days
- `picture` field gives the LinkedIn profile photo URL — can be used in the badge

### What NOT to do:
- Do NOT use the old LinkedIn v2 OAuth (deprecated)
- Do NOT request `w_member_social` scope — requires Partner Program approval

---

## Database

**Neon (serverless Postgres) + Drizzle ORM** (HIGH confidence)

- Neon free tier: 512MB storage, sufficient for thousands of users (only storing name, email, LinkedIn sub, progress)
- Drizzle is type-safe and lightweight — no heavy ORM overhead
- Neon integrates directly with Vercel via the Vercel Marketplace (auto env vars)

### Alternative: Supabase
- Also viable if already have a Supabase account/project
- Slightly more setup but more features (realtime, built-in auth — though we're using Auth.js)
- **Use Supabase if the developer already has an account** — avoid adding new services unnecessarily

### What NOT to use:
- PlanetScale — shut down free tier
- Firebase — JS SDK is heavy and overkill for a simple data model
- localStorage only — can't share progress across devices, fragile

---

## Styling

**Tailwind CSS v4** (HIGH confidence)

- Zero config, utility-first, fast iteration
- v4 is stable as of 2025 and removes the need for `tailwind.config.js`

---

## Certificate / Badge Generation

**`next/og` (ImageResponse)** — built into Next.js App Router (HIGH confidence — verified from Vercel docs)

- Write JSX → get a PNG served from a Next.js API route
- Uses Satori + Resvg under the hood — fast, edge-compatible
- No extra install needed
- Creates a stable URL like `/api/certificate/[userId]` that returns the PNG
- LinkedIn crawler fetches the `og:image` automatically when the URL is shared

### How sharing works:
1. User completes tutorial → app generates a certificate page at `/certificate/[userId]`
2. Page has `<meta property="og:image" content="/api/certificate/[userId]">` 
3. Share button opens `https://www.linkedin.com/sharing/share-offsite/?url=[certificate-url]`
4. LinkedIn crawler fetches the page, renders the og:image as the post preview
5. User also gets a "Download badge" button (direct link to the PNG)

### What NOT to use:
- Puppeteer — 50MB binary, 2-5s cold starts on serverless, overkill
- html2canvas — browser-only, no server-side generation for og:image
- Canvas API directly — more complex than `next/og` JSX approach

---

## Hosting

**Vercel** (HIGH confidence)

- Next.js is made by Vercel — zero config deployment
- Free/hobby tier supports this project comfortably
- `next/og` runs on Vercel Edge Runtime — fast image generation
- Neon integrates via Vercel Marketplace

---

## Summary Table

| Layer | Choice | Version | Confidence |
|-------|--------|---------|------------|
| Framework | Next.js App Router | 15.x | HIGH |
| Language | TypeScript | 5.x | HIGH |
| Auth | Auth.js | v5 | HIGH |
| Auth Provider | LinkedIn OIDC | — | HIGH |
| Database | Neon + Drizzle ORM | latest | HIGH |
| Styling | Tailwind CSS | v4 | HIGH |
| Badge generation | next/og (ImageResponse) | built-in | HIGH |
| Hosting | Vercel | — | HIGH |

---

## Critical Pre-Launch Step

**LinkedIn Developer App setup takes time.** Create the LinkedIn Developer App and request "Sign in with LinkedIn using OpenID Connect" product approval **before** starting development. This can take 1-3 days.

*Research completed: 2026-04-02*
