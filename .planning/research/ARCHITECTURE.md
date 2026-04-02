# Architecture Research — Claude Code Tutorial Lead Magnet

## Approach: Next.js Multi-Page App on Vercel

**Multi-page app, NOT a SPA.** Each level gets a real URL (`/tutorial/1` through `/tutorial/7`). Auth gating happens server-side — no content flash, no client-side redirects.

---

## Components

### 1. Auth Layer
- Auth.js v5 with LinkedIn OIDC
- Session stored in a signed cookie (JWT strategy — no DB session table needed)
- On first login: capture `name`, `email`, `picture` from LinkedIn, persist to DB
- Middleware protects `/tutorial/*` routes — unauthenticated users redirect to `/`

### 2. Tutorial Content Layer
- Content stored as **static TypeScript/MDX files** in the repo (not in the DB)
- Each level = one file: `content/levels/level-1.ts`, etc.
- Structure per level: title, concept explanation, step-by-step instructions, code snippets to copy, completion criteria (what the user should see/do to mark as done)
- Content deploys with the code — easy to update

### 3. Progress Layer
- On level completion: POST to `/api/progress` → updates DB
- On page load: server reads progress from DB to determine which levels are unlocked
- Simple state: `completed_levels: INTEGER[]` array per user

### 4. Badge / Certificate Layer
- Stateless on-demand PNG generation at `/api/og?userId=X`
- Uses `next/og` (ImageResponse) — writes JSX, returns PNG
- Vercel CDN caches the result automatically
- Certificate page at `/certificate/[userId]` has `og:image` pointing to that route
- Share button: `https://www.linkedin.com/sharing/share-offsite/?url=/certificate/[userId]`
- Download button: direct link to `/api/og?userId=X`

### 5. Landing / Registration Page
- `/` — public, explains what the tutorial is, shows the LinkedIn login button
- After login → redirect to `/tutorial/1` (or current level if returning)

---

## Data Model

Two tables only:

```sql
-- users
id            UUID PRIMARY KEY
linkedin_id   TEXT UNIQUE NOT NULL
name          TEXT NOT NULL
email         TEXT
picture_url   TEXT
created_at    TIMESTAMP DEFAULT NOW()

-- progress
id            UUID PRIMARY KEY
user_id       UUID REFERENCES users(id)
completed_levels  INTEGER[] DEFAULT '{}'
last_seen_level   INTEGER DEFAULT 1
updated_at    TIMESTAMP DEFAULT NOW()
```

No content in the DB. No sessions table. No analytics table (v1).

---

## Data Flow

```
User hits /
  → Not logged in → Landing page with "Ingresar con LinkedIn"
  → LinkedIn OAuth → callback → Auth.js creates session
  → User record upserted in DB
  → Redirect to /tutorial/1 (or last seen level)

User on /tutorial/N
  → Server reads session (cookie) + progress from DB
  → Renders level content (static) + progress state
  → User follows steps on their machine
  → Clicks "Completé este nivel"
  → POST /api/progress { level: N }
  → DB updated → redirect to /tutorial/N+1

User completes level 7
  → Redirect to /certificate/[userId]
  → Page renders badge preview + share button + download button
  → Share opens LinkedIn share dialog with og:image pre-populated
```

---

## Routing Structure

```
/                          → Landing (public)
/tutorial/[level]          → Tutorial level 1-7 (auth required)
/certificate/[userId]      → Completion certificate (public — shareable link)
/api/auth/[...nextauth]    → Auth.js handler
/api/progress              → POST: update progress (auth required)
/api/og                    → GET: generate certificate PNG
```

---

## Build Order (Phase Dependencies)

1. **Auth layer** — everything else requires knowing who the user is
2. **DB schema + progress API** — needed before tutorial can track state
3. **Tutorial shell** — layout, navigation, level unlock logic
4. **Tutorial content** — fill in the 7 levels
5. **Badge/certificate** — requires user data from DB
6. **Landing page + polish** — conversion-optimized entry point

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Multi-page, not SPA | Server-side auth gating, real URLs for sharing, better SEO for certificate pages |
| Content in files, not DB | Simpler, version-controlled, no CMS needed for v1 |
| Neon over localStorage | Cross-device progress, lead data queryable for creator, free tier sufficient |
| JWT sessions (no DB sessions table) | Simpler — one less table, stateless |
| next/og for badges | Built-in, no extra service, CDN-cached, generates og:image for LinkedIn |

*Research completed: 2026-04-02*
