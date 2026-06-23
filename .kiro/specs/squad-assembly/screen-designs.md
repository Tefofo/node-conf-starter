# Screen Designs v2 — SquadRec

Reference: `SquadRec_Screens_v2.html` (interactive HTML prototype)

## Screens

| Screen | ID | API Calls |
|--------|-----|-----------|
| Dashboard | s-dashboard | None (static data) |
| Create Step 1 — Basic Details | s-create-a | None |
| Create Step 2 — Skill Slots | s-create-b | POST /api/v1/delivery-needs |
| Delivery Need Detail | s-detail | (GET /api/v1/delivery-needs/{id} — future) |
| Loading / Generating | s-loading | POST /api/v1/delivery-needs/{id}/recommendations |
| Recommendations | s-recs | GET /api/v1/delivery-needs/{id}/recommendations |
| Confirm Squad | s-confirm | POST /api/v1/delivery-needs/{id}/squad |
| Success | s-success | (result of POST /squad) |

## Design Tokens
- Navy nav: #0F1B2D
- Blue primary: #2563EB
- Font: Inter
- Status badges match DeliveryNeedStatus enum exactly: CREATED, PENDING_MATCH, MATCHED, ASSEMBLING, ASSEMBLED, CANCELLED

## Key UX Rules
- Title has 120-char counter (FR-DN-005)
- Description is optional (FR-DN-011 COULD)
- Continue button disabled when no skill slots exist (FR-DN-009)
- Recommendations grouped by skill slot with 4 score bars (FR-RG-005)
- Squad sidebar is client-side state only — no API call on select
- Confirm screen shows 409 and 404 error banners
- Success screen has ASSEMBLED and PARTIALLY_ASSEMBLED states (FR-SQ-002, FR-SQ-003)
