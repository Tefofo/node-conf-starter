# Project Steering — Squad Assembly Prototype

## Spec Documents

This project implements the following specifications:

- #docs/docs-api-spec.md
- #docs/docs-architecture.md
- #docs/docs-brd.md
- #docs/docs-test-cases.md

## Tech Stack (confirmed)

- Language: TypeScript (strict mode)
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: In-memory mock (prototype); SQLite + Prisma path available
- Testing: Vitest (unit) + Playwright (E2E)
- Package manager: npm workspaces monorepo

## Conventions

- API paths: `/api/v1/...`
- ID formats: DN-NNNNN (delivery needs), SQ-NNNNN (squads), E### (employees)
- Error format: `{ errorCode, message, timestamp, path }`
- Scoring formula: `compositeScore = (skillMatch × 0.40) + (availability × 0.30) + (workload × 0.20) + (roleAlignment × 0.10)`
