# Requirements — Squad Assembly Prototype

## References

- [API Specification v1.1](../../../docs/docs-api-spec.md)
- [Architecture Document v2.0](../../../docs/docs-architecture.md)
- [Business Requirements Document v1.0](../../../docs/docs-brd.md)
- [Test Case Specification v1.0](../../../docs/docs-test-cases.md)

---

## Delivery Need Capture — POST /api/v1/delivery-needs

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-DN-001 | Ubiquitous | MUST | The system shall assign a unique deliveryNeedId in format DN-NNNNN to every delivery need at creation. | TC-DN-01, TC-DN-02 |
| FR-DN-002 | Ubiquitous | MUST | The system shall record createdAt (UTC) and createdBy (JWT sub) on every delivery need. | TC-DN-01 |
| FR-DN-003 | Event-driven | MUST | When a valid delivery need is submitted, the system shall return HTTP 201 with deliveryNeedId, status "CREATED", createdAt, createdBy. | TC-DN-01, TC-DN-02, TC-DN-03 |
| FR-DN-004 | Event-driven | MUST | When a delivery need is created, the system shall set status to "CREATED". | TC-DN-01 |
| FR-DN-005 | Unwanted | MUST | If title is absent or exceeds 120 characters, the system shall return HTTP 400 VALIDATION_ERROR. | TC-DN-05, TC-DN-11 |
| FR-DN-006 | Unwanted | MUST | If urgency is not LOW/MEDIUM/HIGH/CRITICAL, the system shall return HTTP 400 VALIDATION_ERROR. | TC-DN-06 |
| FR-DN-007 | Unwanted | MUST | If any requiredSkills entry has an invalid SkillLevel, the system shall return HTTP 400 VALIDATION_ERROR. | TC-DN-07 |
| FR-DN-008 | Unwanted | MUST | If startDate is in the past, the system shall return HTTP 422. | TC-DN-08 |
| FR-DN-009 | Unwanted | MUST | If requiredSkills is empty or absent, the system shall return HTTP 422. | TC-DN-09 |
| FR-DN-010 | Unwanted | MUST | If durationWeeks < 1, the system shall return HTTP 400 VALIDATION_ERROR. | TC-DN-10 |
| FR-DN-011 | Optional | COULD | Where description is included, the system shall store and return it. | TC-DN-01 |

---

## Candidate Search — POST /api/v1/candidates/search

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-CS-001 | Event-driven | MUST | When a valid search is received, the system shall return candidates matching at least one skill available by the requested date. | TC-CS-01, TC-CS-02 |
| FR-CS-002 | Ubiquitous | MUST | The system shall include total, page, pageSize in every search response. | TC-CS-01, TC-CS-04 |
| FR-CS-003 | Ubiquitous | MUST | The system shall default page to 1 and pageSize to 20 when absent. | TC-CS-01 |
| FR-CS-004 | State-driven | MUST | While a candidate's availabilityStatus is ON_LEAVE and the requested date falls within leave, the system shall exclude them. | TC-CS-01, TC-CS-03 |
| FR-CS-005 | State-driven | SHOULD | While currentAllocationPercentage exceeds maxWorkloadPercentage, the system shall exclude that candidate. | TC-CS-03 |
| FR-CS-006 | Event-driven | MUST | When no candidates match, the system shall return HTTP 200 with empty candidates array and total 0. | TC-CS-05 |
| FR-CS-007 | Unwanted | MUST | If skills is absent or empty, the system shall return HTTP 400 VALIDATION_ERROR. | TC-CS-06, TC-CS-07 |
| FR-CS-008 | Unwanted | MUST | If pageSize > 100, the system shall return HTTP 400 VALIDATION_ERROR. | TC-CS-09 |
| FR-CS-009 | Unwanted | MUST | If maxWorkloadPercentage < 1 or > 100, the system shall return HTTP 400 VALIDATION_ERROR. | TC-CS-08 |
| FR-CS-010 | Event-driven | SHOULD | When page exceeds total pages, the system shall return HTTP 200 with empty candidates array. | TC-CS-12 |

---

## Recommendation Generation — POST /api/v1/delivery-needs/{id}/recommendations

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-RG-001 | Event-driven | MUST | When a recommendation request is received, the system shall begin scoring and return HTTP 200 with status PENDING or PROCESSING. | TC-RG-01 |
| FR-RG-002 | Ubiquitous | MUST | The system shall return a skillSlots array — each entry contains skill, level, quantityRequired, and a ranked candidates array. | TC-RG-01, TC-RG-09 |
| FR-RG-003 | Ubiquitous | MUST | The system shall rank candidates within each slot by compositeScore descending. | TC-RG-02 |
| FR-RG-004 | Ubiquitous | MUST | The system shall compute compositeScore = (skillMatch × 0.40) + (availability × 0.30) + (workload × 0.20) + (roleAlignment × 0.10). | TC-RG-03, TC-RG-10 |
| FR-RG-005 | Ubiquitous | MUST | The system shall include a scoreBreakdown with all four sub-scores in every candidate entry. | TC-RG-03 |
| FR-RG-007 | Event-driven | MUST | When scoring completes, the system shall set status COMPLETED and record generatedAt. | TC-RG-01 |
| FR-RG-008 | Event-driven | MUST | When POST /recommendations is called again, the system shall regenerate and overwrite — not return 409. | TC-RG-04 |
| FR-RG-009 | State-driven | MUST | While filtering, the system shall exclude candidates whose SkillLevel ordinal is below the slot's required level. | TC-RG-09 |
| FR-RG-010 | Event-driven | SHOULD | When a slot has no candidates, the system shall return it with an empty candidates array. | TC-RG-05 |
| FR-RG-011 | Unwanted | MUST | If the scoring engine fails, the system shall set status FAILED and return HTTP 500. | TC-RG-07 |
| FR-RG-012 | Unwanted | MUST | If deliveryNeedId does not exist, the system shall return HTTP 404. | TC-RG-06 |

---

## Recommendation Retrieval — GET /api/v1/delivery-needs/{id}/recommendations

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-GR-001 | Event-driven | MUST | When status is COMPLETED, the system shall return HTTP 200 with the full skill-slotted payload. | TC-GR-01 |
| FR-GR-002 | State-driven | MUST | While status is PENDING or PROCESSING, the system shall return HTTP 200 with Retry-After header. | TC-GR-02, TC-GR-07 |
| FR-GR-003 | State-driven | MUST | While status is FAILED, the system shall return HTTP 200 with status "FAILED" — not HTTP 500. | TC-GR-03 |
| FR-GR-004 | Unwanted | MUST | If no recommendation has been generated for the need, the system shall return HTTP 404. | TC-GR-04 |
| FR-GR-005 | Unwanted | MUST | If deliveryNeedId does not exist, the system shall return HTTP 404. | TC-GR-05 |

---

## Candidate Profile — GET /api/v1/candidates/{employeeId}

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-CP-001 | Event-driven | MUST | When a valid profile request is received, the system shall return employeeId, name, role, skills[], availability object, and activeProjects[]. | TC-CP-01 |
| FR-CP-002 | Ubiquitous | MUST | currentAllocationPercentage + availableCapacityPercentage shall always sum to 100. | TC-CP-02 |
| FR-CP-003 | State-driven | MUST | While availabilityStatus is ON_LEAVE, the system shall include a non-null availableFrom date. | TC-CP-04 |
| FR-CP-004 | Event-driven | MUST | When a candidate has no assignments, the system shall return an empty activeProjects array. | TC-CP-03 |
| FR-CP-005 | Unwanted | MUST | If employeeId does not exist, the system shall return HTTP 404. | TC-CP-05 |

---

## Squad Confirmation — POST /api/v1/delivery-needs/{id}/squad

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| FR-SQ-001 | Event-driven | MUST | When a valid squad confirmation is received, the system shall return HTTP 201 with squadId (SQ-NNNNN), status, memberCount, assembledAt, confirmedBy. | TC-SQ-01 |
| FR-SQ-002 | Event-driven | MUST | When all required skill slots have at least one assignment, the system shall set Squad status ASSEMBLED. | TC-SQ-01 |
| FR-SQ-003 | Event-driven | MUST | When assignments do not cover all slots, the system shall set status PARTIALLY_ASSEMBLED. | TC-SQ-02 |
| FR-SQ-004 | Event-driven | MUST | When a squad is confirmed, the system shall update each candidate's currentAllocationPercentage. | TC-SQ-01, TC-SQ-03, TC-SQ-04 |
| FR-SQ-005 | Unwanted | MUST | If confirmedBy is absent, the system shall return HTTP 400 VALIDATION_ERROR. | TC-SQ-05 |
| FR-SQ-006 | Unwanted | MUST | If allocationPercent < 1 or > 100, the system shall return HTTP 400 VALIDATION_ERROR. | TC-SQ-06, TC-SQ-07 |
| FR-SQ-007 | Unwanted | MUST | If any candidateId does not exist, the system shall return HTTP 404 and create no assignments. | TC-SQ-08 |
| FR-SQ-008 | Unwanted | MUST | If any candidate is UNAVAILABLE or ON_LEAVE, the system shall return HTTP 409 and create no assignments. | TC-SQ-10 |
| FR-SQ-009 | Unwanted | MUST | If deliveryNeedId does not exist, the system shall return HTTP 404. | TC-SQ-09 |
| FR-SQ-010 | State-driven | SHOULD | While a Squad exists for a deliveryNeedId, a second POST /squad shall return HTTP 409 unless status is DISBANDED. | TC-SQ-11 |

---

## Non-Functional Requirements

| REQ ID | EARS Pattern | Priority | Requirement | Test Case(s) |
|--------|-------------|----------|-------------|-------------|
| NFR-SEC-001 | Ubiquitous | MUST | The system shall require a valid JWT Bearer token on every request. | TC-DN-12, TC-CS-10 |
| NFR-SEC-002 | Unwanted | MUST | If Authorization header is absent, the system shall return HTTP 401 UNAUTHORIZED. | TC-DN-12, TC-CP-07, TC-SQ-13 |
| NFR-SEC-003 | Unwanted | MUST | If the JWT signature is invalid, the system shall return HTTP 401 INVALID_TOKEN. | TC-CS-10 |
| NFR-SEC-004 | Unwanted | MUST | If the JWT has expired, the system shall return HTTP 401 TOKEN_EXPIRED. | TC-DN-13 |
| NFR-SEC-005 | Unwanted | MUST | If the token lacks the required scope, the system shall return HTTP 403 ACCESS_DENIED. | TC-DN-14, TC-CS-11, TC-RG-08, TC-SQ-12 |
| NFR-SEC-007 | Ubiquitous | MUST | The system shall never include stack traces in error responses. | TC-CC-01 through TC-CC-05 |
| NFR-ERR-001 | Ubiquitous | MUST | All errors shall use format: { errorCode, message, timestamp, path }. | TC-CC-01 through TC-CC-05 |
| NFR-ERR-002 | Ubiquitous | MUST | Every response shall include an X-Request-Id (UUID v4) header. | TC-MH-01 |
| NFR-ERR-003 | Ubiquitous | MUST | Every 2xx response shall include an X-Response-Time header (e.g. "742ms"). | TC-MH-02 |
| NFR-RL-002 | State-driven | MUST | While a standard user has sent ≥100 requests in 60s, the system shall return HTTP 429 RATE_LIMIT_EXCEEDED. | TC-RL-01, TC-RL-02 |
| NFR-PER-001 | Ubiquitous | MUST | POST /delivery-needs shall respond within 1s at P95. | TC-PF-01 |
| NFR-PER-004 | State-driven | MUST | With ≤100 candidates, scoring shall complete within 2s. | TC-PF-02 |
