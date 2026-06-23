# Design — Squad Assembly Prototype

## References

- [API Specification v1.1](../../../docs/docs-api-spec.md)
- [Architecture Document v2.0](../../../docs/docs-architecture.md)

---

## Components

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| Client Application | React 18 + Vite + Tailwind CSS | SPA for Delivery Leads: create needs, view recommendations, confirm squads |
| API Layer | Express + TypeScript (strict) | REST endpoints, input validation, error shaping |
| Recommendation Engine | TypeScript module (in-process) | 40/30/20/10 weighted scoring per skill slot |
| Data Store | In-memory mock arrays | Employee, DeliveryNeed, Squad, SquadAssignment records |

---

## UI Screens → API Endpoints

Every screen below lists the exact API call(s) it makes.

| Screen | API Endpoint(s) Called | HTTP Method | Notes |
|--------|------------------------|-------------|-------|
| Dashboard | None | — | Reads in-memory data already in client state |
| Create Step 1 — Basic Details | None | — | Client-side form; no API call until Step 2 submitted |
| Create Step 2 — Skill Slots | `POST /api/v1/delivery-needs` | POST | Submits title, urgency, startDate, durationWeeks, requiredSkills[] |
| Delivery Need Detail | `POST /api/v1/delivery-needs/{id}/recommendations` | POST | "Generate Recommendations" button triggers this |
| Loading / Generating | `GET /api/v1/delivery-needs/{id}/recommendations` | GET | Polls until status = COMPLETED or FAILED |
| Recommendations | `GET /api/v1/candidates/{employeeId}` | GET | On candidate row click → opens profile drawer (prototype: shows inline data) |
| Confirm Squad | `POST /api/v1/delivery-needs/{id}/squad` | POST | Submits confirmedBy, notes, assignments[] |
| Success | None | — | Displays result from POST /squad response |

---

## API Endpoints → Requirements

Every endpoint is referenced by at least one EARS requirement.

| Endpoint | Method | Requirements |
|----------|--------|-------------|
| /api/v1/delivery-needs | POST | FR-DN-001 through FR-DN-011 |
| /api/v1/candidates/search | POST | FR-CS-001 through FR-CS-010 |
| /api/v1/delivery-needs/{id}/recommendations | POST | FR-RG-001 through FR-RG-012 |
| /api/v1/delivery-needs/{id}/recommendations | GET | FR-GR-001 through FR-GR-005 |
| /api/v1/candidates/{employeeId} | GET | FR-CP-001 through FR-CP-005 |
| /api/v1/delivery-needs/{id}/squad | POST | FR-SQ-001 through FR-SQ-010 |

---

## Data Model

Every entity listed supports at least one API endpoint.

| Entity | Key Fields | Supports Endpoints |
|--------|-----------|-------------------|
| Employee | employeeId (E###), name, role, skills[]{name, level}, availabilityStatus, currentAllocationPercentage, availableFrom | POST /candidates/search · GET /candidates/{id} · POST /{id}/recommendations |
| DeliveryNeed | deliveryNeedId (DN-#####), title, urgency, startDate, durationWeeks, requiredSkills[]{skill, level, quantity}, status, createdBy, createdAt | POST /delivery-needs · POST /{id}/recommendations · GET /{id}/recommendations |
| Squad | squadId (SQ-#####), deliveryNeedId, status, confirmedBy, notes, assembledAt | POST /{id}/squad |
| SquadAssignment | candidateId, skill, agreedStartDate, allocationPercent | POST /{id}/squad (nested in Squad) |

---

## Scoring Formula

```
compositeScore = (skillMatch × 0.40) + (availability × 0.30) + (workload × 0.20) + (roleAlignment × 0.10)
```

- All four sub-scores are integers 0–100 (per FR-RG-004, FR-RG-005)
- Candidates with SkillLevel ordinal below slot requirement are excluded (FR-RG-009): JUNIOR=1, MID=2, SENIOR=3, LEAD=4, PRINCIPAL=5
- Top 5 candidates returned per slot, ranked descending by compositeScore (FR-RG-003)

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| In-memory mock data | Zero infrastructure setup — prototype runs with `npm run dev` only |
| TypeScript strict mode | Catches implicit any and null errors at compile time, especially in scoring engine |
| npm workspaces monorepo | Single `npm install` installs both server and client |
| Error format `{ errorCode, message, timestamp, path }` | Matches NFR-ERR-001 — consistent across all 4xx/5xx responses |
| No real JWT validation | Auth middleware is stubbed for prototype; scope/role checks documented but not enforced |
