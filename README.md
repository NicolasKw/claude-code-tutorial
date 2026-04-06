# Claude Code Tutorial

Tutorial interactivo de 7 niveles para aprender Claude Code construyendo un agente de investigación de startups.

## Qué cubre

| Nivel | Tema |
|-------|------|
| 0 | Chatbot — primera sesión |
| 1 | Plan Mode |
| 2 | CLAUDE.md |
| 3 | Commands, Skills y Hooks |
| 4 | MCP Servers |
| 5 | GSD Framework |
| 6 | Sub-agentes |
| 7 | RALPH Loop |

## Stack

- **Next.js 16** (App Router)
- **Drizzle ORM** + **Supabase** (Postgres)
- **TypeScript**
- Soporte ES / EN

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # agregar DATABASE_URL y DIRECT_URL de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

```
DATABASE_URL=    # Supabase connection pooling URL
DIRECT_URL=      # Supabase direct URL (para migraciones)
```

## Migraciones

```bash
npm run db:generate   # generar migraciones desde el schema
npm run db:migrate    # aplicar migraciones
```
