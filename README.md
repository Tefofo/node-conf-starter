# SquadRec — Rapid Assembly of Cross-Functional Delivery Squads

A working prototype that helps a Delivery Lead rapidly assemble a cross-functional squad for a piece of work. Capture a delivery need, specify required skills, urgency, and duration — and get a ranked shortlist of suitable internal candidates scored on skill match, availability, role alignment, and workload.

## Prerequisites

- **Node.js 22 LTS** (pinned via `.nvmrc`)
- **npm 10+** (ships with Node 22)

Check your version:

```bash
node -v   # must be v20 or higher
npm -v    # must be v10 or higher
```

If you use a version manager:

```bash
nvm use   # or: fnm use
```

## Quick Start

```bash
# 1. Install all dependencies (both server and client)
npm install

# 2. Start both apps together
npm run dev
```

Open your browser:

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

The Vite dev server automatically proxies all `/api/*` requests to the backend — no extra config needed.

> **Note:** Data is stored in-memory. It resets every time the server restarts. This is by design for the prototype.

## How to Use the App

1. **Dashboard** — see all delivery needs by status
2. **New Delivery Need** — click `+ New Delivery Need`, fill in the title, urgency, start date, and duration
3. **Add Skill Slots** — add the skills you need (e.g. `Solution Architecture / SENIOR / 1 person`)
4. **Generate Recommendations** — the engine scores all candidates and returns a ranked shortlist grouped by skill slot
5. **Select Candidates** — click to select the best person for each slot; see the coverage bar update
6. **Confirm Squad** — set start dates and allocation percentages, then confirm

## Available Skills in Mock Data

The prototype includes 16 employees across these skills:

`Solution Architecture` · `Cloud Architecture` · `Java Development` · `React Development` · `QA Testing` · `QA Automation` · `Performance Testing` · `Data Engineering` · `Python` · `SQL` · `DevOps` · `Kubernetes` · `UX Design` · `User Research` · `Agile Delivery` · `Stakeholder Management` · `Requirements Analysis` · `Facilitation` · `Microservices` · `API Design` · `Security Architecture`

> Skill names are case-insensitive but must match the list above exactly.

## Scoring Formula

Each candidate is scored per skill slot using:

```
compositeScore = (skillMatch × 0.40) + (availability × 0.30) + (workload × 0.20) + (roleAlignment × 0.10)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/delivery-needs` | List all delivery needs |
| POST | `/api/v1/delivery-needs` | Create a delivery need |
| POST | `/api/v1/delivery-needs/{id}/recommendations` | Generate ranked recommendations |
| GET | `/api/v1/delivery-needs/{id}/recommendations` | Retrieve recommendations |
| GET | `/api/v1/candidates/{employeeId}` | Get a candidate profile |
| POST | `/api/v1/candidates/search` | Search candidates by skill |
| POST | `/api/v1/delivery-needs/{id}/squad` | Confirm the squad |
| POST | `/api/v1/auth/refresh` | Refresh access token (stub) |

## Project Structure

```
node-conf-starter/
├── server/src/
│   ├── data/
│   │   ├── employees.ts       # 16 mock employees with skills & availability
│   │   └── workRequests.ts    # In-memory delivery needs & squads store
│   ├── scoring/
│   │   └── engine.ts          # 40/30/20/10 scoring formula
│   ├── routes/
│   │   └── squads.ts          # All API endpoints
│   └── index.ts               # Express server entry point
├── client/src/
│   ├── screens/
│   │   ├── Dashboard.tsx      # Live delivery needs list
│   │   ├── CreateStepA.tsx    # Basic details form
│   │   ├── CreateStepB.tsx    # Skill slots form
│   │   ├── Recommendations.tsx # Ranked candidates by skill slot
│   │   └── Screens.tsx        # Loading, NeedDetail, ConfirmSquad, Success
│   ├── components/
│   │   ├── Layout.tsx         # Nav + topbar shell
│   │   └── ui.tsx             # Badge, Button, Card, Avatar etc.
│   └── App.tsx                # Screen routing + API calls
├── .kiro/                     # Kiro spec files
│   ├── steering.md
│   ├── hooks/lint-on-save.json
│   └── specs/squad-assembly/
│       ├── requirements.md
│       ├── design.md
│       ├── tasks.md
│       └── screen-designs.md
└── package.json               # npm workspaces root
```

## Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start backend + frontend together |
| `npm run build` | Type-check and build both apps |
| `npm run lint` | Lint all TypeScript files |
| `npm test` | Run all unit tests |
