# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## RallyHub (Shuttle Connect)

Vietnamese badminton community web app. Frontend at `artifacts/shuttle-connect/` (React + Vite + wouter + TanStack Query). Backend at `artifacts/api-server/` (Express 5) with JSON file storage in `.data/` (no database). All UI pages call generated React Query hooks from `@workspace/api-client-react`. Auth is a simple username-only login persisted in localStorage.

### API Routes
- `POST /api/auth/login` — login or auto-create user
- `PATCH /api/auth/profile` — update username, avatar, skillLevel
- `GET/POST /api/posts` — list and create match posts (open rooms)
- `POST /api/posts/:id/join` — join a post (auto-accepts)
- `POST /api/posts/:id/accept` — explicitly accept a join request
- `GET /api/matches` — list completed/full matches
- `GET /api/matches/:id` — get a single match
- `POST /api/matches/:id/confirm` — confirm match result
- `GET/POST /api/products` — list and create marketplace items
- `GET /api/clans` — list clans
- `GET /api/clans/:id` — get clan details
- `POST /api/clans/:id/join` — join a clan

OpenAPI spec lives at `lib/api-spec/openapi.yaml`; rerun codegen after editing.

### Frontend Pages
- `/login` — username-only login (creates user if new)
- `/register` — register with phone, DOB, CCCD fields (stored in localStorage as `shuttle_connect_extra`)
- `/home` — dashboard with open matches, clans, products from API
- `/matches` — browse and filter open posts from API
- `/match/:id` — post detail with join button
- `/confirmed/:id` — active match confirm screen
- `/create` — create a new match post
- `/clans` — list clans from API
- `/clans/:id` — clan detail: overview uses `useListPosts` for upcoming matches, members tab uses `clan.memberNames`, matches tab uses `useListPosts` + `useListMatches`
- `/marketplace` — list products from API
- `/marketplace/:id` — product detail from API
- `/marketplace/sell` — sell item form
- `/profile` — user profile: match history from `useListPosts` + `useListMatches` filtered by username, frequent partners computed from real match data

### Auth & Extra Info
- `src/lib/auth.tsx` — `AuthProvider` stores `user` (username), `userProfile` (from API), and `extraInfo` (phone, dob, nationalId, avatarUrl) in localStorage key `shuttle_connect_extra`.
- Avatar uploads use FileReader → data URL, stored in `extraInfo.avatarUrl` (localStorage).
- Extra fields are NOT sent to API (API `User` type only has id, username, avatar, skillLevel).

### Key Components
- `src/components/ai-chat.tsx` — Rally AI floating chatbot (uses live API data for matches/clans/products)
- `src/components/layout.tsx` — `Navbar` and `BottomNav`

### Deleted Files
- `src/data/mockData.ts` — was unused; all pages already used API hooks directly

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Storage**: JSON files in `artifacts/api-server/.data/` (seeded on first run)
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter
- **Data fetching**: TanStack Query v5

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
