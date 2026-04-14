# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS v4 + shadcn/ui + Framer Motion

## Applications

### Leakr (`artifacts/leakr`) — preview path `/`
Secure marketplace connecting journalists with anonymous sources/whistleblowers.
- Dark navy + electric cyan UI aesthetic
- Full-stack: React/Vite frontend + Express API + PostgreSQL

**Pages:**
- `/` — Landing page ("Truth in the Shadows")
- `/leaks` — Intelligence feed: filterable/searchable leak browsing
- `/leaks/:id` — Leak dossier detail + claim action
- `/leaks/submit` — Anonymous secure submission form
- `/dashboard` — Platform intel dashboard: stats, activity feed, sensitivity breakdown
- `/journalists` — Browse journalist profiles
- `/journalists/:id` — Journalist profile detail
- `/journalists/new` — Register journalist profile

**API Routes:**
- `GET /api/leaks` — list leaks (filterable by category, sensitivity, status, search)
- `POST /api/leaks` — submit a leak (auto-generates anonymous handle)
- `GET /api/leaks/:id` — get leak + increment view count
- `PATCH /api/leaks/:id` — update leak status
- `POST /api/leaks/:id/claim` — journalist claims a leak
- `GET /api/journalists` — list journalists
- `POST /api/journalists` — create journalist profile
- `GET /api/journalists/:id` — get journalist profile
- `PATCH /api/journalists/:id` — update journalist profile
- `GET /api/categories` — list categories with leak counts
- `GET /api/stats/platform` — aggregate platform stats
- `GET /api/stats/recent-activity` — recent activity feed
- `GET /api/stats/sensitivity-breakdown` — leaks by sensitivity level

**DB Tables:** `leaks`, `journalists`, `categories`, `activity_events`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
