# Tasks — Squad Assembly Prototype

## Implementation Tasks

- [x] Task 1: Create mock employee data with SkillLevel enum, AvailabilityStatus, E-prefixed IDs
- [x] Task 2: Create DeliveryNeed and Squad in-memory stores with DN-NNNNN/SQ-NNNNN ID generators
- [x] Task 3: Implement scoring engine with 40/30/20/10 formula, skill-slot grouping, level filtering
- [x] Task 4: Implement POST /api/v1/delivery-needs with full validation (title, urgency, requiredSkills, startDate, durationWeeks)
- [x] Task 5: Implement POST /api/v1/candidates/search with skill matching, availability filtering, pagination
- [x] Task 6: Implement POST /api/v1/delivery-needs/{id}/recommendations returning skill-slotted ranked candidates
- [x] Task 7: Implement GET /api/v1/delivery-needs/{id}/recommendations
- [x] Task 8: Implement GET /api/v1/candidates/{employeeId} with availability object and activeProjects
- [x] Task 9: Implement POST /api/v1/delivery-needs/{id}/squad with assignment validation, 409 conflict, allocation update
- [x] Task 10: Build React frontend — Create Delivery Need form with skill slots (skill + level + quantity)
- [x] Task 11: Build React frontend — Recommendations view grouped by skill slot with score breakdown
- [x] Task 12: Build React frontend — Squad confirmation flow and success summary
- [x] Task 13: Configure TypeScript strict mode in root tsconfig.json
- [x] Task 14: Configure ESLint
- [ ] Task 15: Write unit tests for scoring engine (TC-RG-03 formula verification)
- [ ] Task 16: Write API integration tests for validation error cases
