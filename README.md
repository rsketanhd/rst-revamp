# Recruitment SMART UI revamp

Front-end revamp of **Recruitment SMART** — an applicant tracking and talent operations product for recruiters and candidates.

This repository is a **Vite + React + TypeScript** single-page app. Screens are driven by local mock data (`src/data`) so you can run the full UI without a backend. Authentication is a demo gate stored in `sessionStorage`.

---

## What this project covers

Two portals share one codebase. Role is chosen on the login screen.

### Recruiter

- Dashboard overview
- Job management (list, create job wizard, applications pipeline)
- Candidates and Candidate Discovery
- Client management (list, create client wizard)
- Jeeves AI
- E2E interviews (one-way interviews, scheduler)
- Offer management (list, create offer wizard, view / withdraw / rescind)
- Reports (job statistics, hiring stage time, offer & hired distribution)
- Settings (module config, templates, triggers, approvals, domain rules, users, roles, branding, and more)

### Candidate

- Dashboard (stats, recently applied, activity)
- My Applications (list + timeline side panel)
- All Jobs (search, filters, recommended jobs, apply / withdraw)
- My Profile
- My Documents (upload well, type filter, file actions)
- Account settings

---

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 |
| Language | TypeScript (strict) |
| Bundler | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Icons | lucide-react |
| HTTP client | axios (present; UI currently uses mock modules) |
| Font | [DM Sans](https://fonts.google.com/specimen/DM+Sans) |

There is no database, auth server, or REST API in this repo. Domain objects live under `src/data` and are copied in memory at runtime.

---

## Prerequisites

- **Node.js** 20+ (the project uses ES2023 and Vite 8)
- **npm** (lockfile is `package-lock.json`)

Confirm:

```bash
node -v
npm -v
```

---

## Local setup

```bash
git clone <repository-url>
cd rst-revamp
npm install
npm run dev
```

The Vite dev server is pinned to **port 5174** (`strictPort: true`) and binds on all interfaces (`host: true`).

Open:

```
http://localhost:5174/login
```

If 5174 is already in use, stop the other process or change `server.port` in `vite.config.ts`.

### Production build

```bash
npm run build
npm run preview
```

`build` runs `tsc` then `vite build`. Preview serves the `dist` output.

---

## Demo logins

On **Sign in**, toggle **Recruiter** or **Candidate**, then use:

| Role | Email | Password |
| --- | --- | --- |
| Recruiter | `ketan@recruitmentsmart.com` | `ketan@12345` |
| Candidate | `john.doe@email.com` | `ketan@12345` |

Session flags are stored in `sessionStorage`:

- `rst_auth` — `"1"` when signed in
- `rst_auth_role` — `"recruiter"` or `"candidate"`

Clearing the tab session signs the user out. Routes under `AppShell` are wrapped in `RequireAuth` and redirect to `/login` when unauthenticated.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on http://localhost:5174 |
| `npm run build` | Type-check (`tsc`) and emit production assets to `dist/` |
| `npm run preview` | Serve the production build locally |

There is no test runner or lint script in `package.json` yet. Type-check via `npx tsc --noEmit` or `npm run build`.

---

## Repository layout

```
src/
  App.tsx                 # Route table
  main.tsx                # React bootstrap
  index.css               # Tailwind theme tokens (brand, accent, shell)
  assets/                 # Logos and static images
  pages/                  # Route-level screens
  components/
    auth/                 # Login, sign-up, role toggle
    layout/               # AppShell, SideNavigation, PageHeader, PageContainer
    ui/                   # Shared primitives (Button, DataTable, SidePanel, Modal, …)
    jobs/ candidates/ clients/ interviews/ offers/ reports/ settings/ …
    my-jobs/ my-applications/ my-documents/ my-profile/ candidate-dashboard/
  data/                   # Mock records and filter helpers
  lib/
    auth.ts               # Demo credentials, validation, session helpers
    cn.ts                 # className join helper
```

Barrel files (`index.ts`) re-export public components from each feature folder.

---

## Architecture notes

### Routing

Defined in `src/App.tsx`. Unauthenticated users hit `/login`. Authenticated users render `AppShell` (sidebar + top bar + outlet). Unknown paths redirect to `/login`. `/` redirects to `/dashboard`.

Role only changes **navigation and which dashboard** is shown. Most recruiter routes remain reachable by URL even as a candidate; treat that as prototype behavior.

### Data

Each module has a typed mock module, for example:

- `src/data/jobs.ts`
- `src/data/myJobs.ts` / `myApplications.ts` / `myDocuments.ts`
- `src/data/offers.ts`
- `src/data/oneWayInterviews.ts`

List screens typically `useMemo(() => getX(), [])` plus local React state for filters, selection, and demo mutations (apply / withdraw, uploads). Refreshing the page resets those in-memory changes unless they were written to `sessionStorage` (auth and some account settings).

### Shared UI

Prefer existing primitives in `src/components/ui` and layout in `src/components/layout`:

- `PageContainer` + `PageHeader` (title **and** subtitle on every page)
- `Button`, `Select`, `Switch`, `Modal`, `SidePanel`, `DataTable`, `toast`

Brand color is navy (`#2D2061` / `brand-*`). Accent/coral is `accent-500` (`#e85a6b`). Tokens live in `src/index.css` `@theme`.

### Conventions

- Imports stay at the **top of the file** (no inline imports).
- `switch` on unions/enums must be **exhaustive** (`default` with `const _exhaustive: never = …`).
- Reuse shared controls instead of one-off markup when a primitive already exists.

---

## Environment

No `.env` files are required for local demo. The app does not currently read `VITE_*` API URLs. When a backend is wired, prefer Vite env vars and keep secrets out of the client bundle.

---

## Browser support

Target modern evergreen browsers (Chromium, Firefox, Safari). The shell uses full-viewport height (`html, body, #root { height: 100%; overflow: hidden }`); inner pages scroll inside `PageContainer`.
