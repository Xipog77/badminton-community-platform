# Badminton Community Platform (Demo Showcase)

This project is a **demo/showcase** for a badminton community platform with a **hand-drawn** UI design system.

## What’s in this demo

- **Auth (demo)**: sign up / sign in with a username + password, then auto-redirect to `/dashboard`.
  - For Vercel friendliness, auth is cookie-based and **stateless**: any credentials that pass validation will work.
- **Static marketplace**: 3 marketplace “template” products using the photo at `/public/img/v1.png`.
- **Static clans**: 5 demo clans.
- **Static match feed**: a larger seeded list of match posts (dates are generated relative to `Date.now()` so they stay “upcoming”).

All demo data is stored in code:
- Match feed posts: `src/mocks/posts.ts`
- Clans/products/match records: `src/mocks/db.ts`

## Local development

### 1) Install dependencies

```powershell
npm install
```

If PowerShell blocks `npm` because of execution policy, use:

```powershell
npm.cmd install
```

### 2) Run the dev server

```powershell
npm.cmd run dev
```

Open:
- http://localhost:3000 (or the port Next prints if 3000 is taken)

## Production build

```powershell
npm.cmd run build
npm.cmd run start
```

## Demo login

1. Go to `/auth/sign-up` or `/auth/sign-in`
2. Use:
   - `username`: 3–30 characters
   - `password`: 6–100 characters (sign-in only validates shape too)
3. You’ll be redirected to `/dashboard`

## Vercel deployment notes

- No database is required for this demo (the UI uses in-code mock tables).
- Build/start commands used by Vercel:
  - Build: `npm run build`
  - Install/Start: `npm run start`
- Images for marketplace templates are served from:
  - `public/img/v1.png`, `public/img/v2.png`, `public/img/v3.png`

## License

MIT

