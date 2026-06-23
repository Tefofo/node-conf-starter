import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { employees, SkillLevel } from '../data/employees.js';
import {
  deliveryNeeds, squads, nextDeliveryNeedId, nextSquadId,
  DeliveryNeed,
} from '../data/workRequests.js';
import { generateRecommendations } from '../scoring/engine.js';

export const squadsRouter = Router();

const VALID_URGENCY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const VALID_LEVELS: SkillLevel[] = ['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'];
const VALID_DN_STATUS = ['CREATED', 'PENDING_MATCH', 'MATCHED', 'ASSEMBLING', 'ASSEMBLED', 'CANCELLED'];

// Middleware: add X-Request-Id to every response
squadsRouter.use((_req: Request, res: Response, next) => {
  res.setHeader('X-Request-Id', randomUUID());
  next();
});

function err(res: Response, req: Request, status: number, errorCode: string, message: string) {
  res.status(status).json({ errorCode, message, timestamp: new Date().toISOString(), path: req.path });
}

// POST /api/v1/auth/refresh
squadsRouter.post('/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return err(res, req, 400, 'VALIDATION_ERROR', 'refreshToken is required.');
  }
  // Simulate expired refresh token
  if (refreshToken === 'expired') {
    return err(res, req, 401, 'TOKEN_EXPIRED', 'Refresh token has expired.');
  }
  res.json({
    accessToken: `mock.access.${randomUUID()}`,
    tokenType: 'Bearer',
    expiresIn: 3600,
  });
});

// GET /api/v1/delivery-needs  (FR-DL-001–004)
squadsRouter.get('/delivery-needs', (req: Request, res: Response) => {
  const { status, urgency, page = '1', pageSize = '20' } = req.query as Record<string, string>;

  if (status && !VALID_DN_STATUS.includes(status)) {
    return err(res, req, 400, 'VALIDATION_ERROR', `status must be one of: ${VALID_DN_STATUS.join(', ')}.`);
  }
  if (urgency && !VALID_URGENCY.includes(urgency)) {
    return err(res, req, 400, 'VALIDATION_ERROR', `urgency must be one of: ${VALID_URGENCY.join(', ')}.`);
  }

  let filtered = [...deliveryNeeds];
  if (status) filtered = filtered.filter((n) => n.status === status);
  if (urgency) filtered = filtered.filter((n) => n.urgency === urgency);

  const p = Math.max(1, parseInt(page));
  const ps = Math.min(100, Math.max(1, parseInt(pageSize)));
  const start = (p - 1) * ps;

  res.json({
    total: filtered.length,
    page: p,
    pageSize: ps,
    items: filtered.slice(start, start + ps).map((n) => ({
      deliveryNeedId: n.deliveryNeedId,
      title: n.title,
      urgency: n.urgency,
      status: n.status,
      createdAt: n.createdAt,
      createdBy: n.createdBy,
    })),
  });
});

// POST /api/v1/delivery-needs  (FR-DN-001–011)
squadsRouter.post('/delivery-needs', (req: Request, res: Response) => {
  const { title, description, urgency, startDate, durationWeeks, requiredSkills } = req.body;

  if (!title || typeof title !== 'string') return err(res, req, 400, 'VALIDATION_ERROR', 'Title is required.');
  if (title.length > 120) return err(res, req, 400, 'VALIDATION_ERROR', 'Title must not exceed 120 characters.');
  if (!VALID_URGENCY.includes(urgency)) return err(res, req, 400, 'VALIDATION_ERROR', `Urgency must be one of: ${VALID_URGENCY.join(', ')}.`);
  if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) return err(res, req, 422, 'VALIDATION_ERROR', 'At least one skill slot is required in requiredSkills.');
  for (const s of requiredSkills) {
    if (!VALID_LEVELS.includes(s.level)) return err(res, req, 400, 'VALIDATION_ERROR', `SkillLevel must be one of: ${VALID_LEVELS.join(', ')}.`);
  }
  if (durationWeeks !== undefined && durationWeeks < 1) return err(res, req, 400, 'VALIDATION_ERROR', 'durationWeeks must be at least 1.');
  if (startDate && new Date(startDate) < new Date(new Date().toISOString().split('T')[0])) return err(res, req, 422, 'VALIDATION_ERROR', 'startDate must not be in the past.');

  const need: DeliveryNeed = {
    deliveryNeedId: nextDeliveryNeedId(),
    title,
    description: description || '',
    urgency,
    startDate: startDate || new Date().toISOString().split('T')[0],
    durationWeeks: durationWeeks || 4,
    requiredSkills,
    status: 'CREATED',
    createdBy: 'deliverylead@company.com',
    createdAt: new Date().toISOString(),
  };

  deliveryNeeds.push(need);

  res.status(201).json({
    deliveryNeedId: need.deliveryNeedId,
    status: 'CREATED',
    createdAt: need.createdAt,
    createdBy: need.createdBy,
  });
});

// POST /api/v1/candidates/search  (QC fix: currentAllocationPercentage)
squadsRouter.post('/candidates/search', (req: Request, res: Response) => {
  const { skills, availabilityStart, maxWorkloadPercentage, page = 1, pageSize = 20 } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) return err(res, req, 400, 'VALIDATION_ERROR', 'skills array is required and must not be empty.');
  if (pageSize > 100) return err(res, req, 400, 'VALIDATION_ERROR', 'pageSize must not exceed 100.');
  if (maxWorkloadPercentage !== undefined && (maxWorkloadPercentage < 1 || maxWorkloadPercentage > 100)) return err(res, req, 400, 'VALIDATION_ERROR', 'maxWorkloadPercentage must be between 1 and 100.');

  const threshold = maxWorkloadPercentage ?? 80;
  const filtered = employees.filter((emp) => {
    if (emp.availabilityStatus === 'ON_LEAVE' || emp.availabilityStatus === 'UNAVAILABLE') return false;
    if (emp.currentAllocationPercentage > threshold) return false;
    const hasSkill = emp.skills.some((s) => skills.some((sk: string) => s.name.toLowerCase() === sk.toLowerCase()));
    if (!hasSkill) return false;
    if (availabilityStart && emp.availableFrom && new Date(emp.availableFrom) > new Date(availabilityStart)) return false;
    return true;
  });

  const start = (page - 1) * pageSize;

  res.json({
    total: filtered.length,
    page,
    pageSize,
    candidates: filtered.slice(start, start + pageSize).map((emp) => ({
      employeeId: emp.employeeId,
      name: emp.name,
      role: emp.role,
      availability: emp.availabilityStatus,
      availableFrom: emp.availableFrom,
      currentAllocationPercentage: emp.currentAllocationPercentage, // ← QC fix v1.2
    })),
  });
});

// POST /api/v1/delivery-needs/:id/recommendations  (FR-RG-001–013)
squadsRouter.post('/delivery-needs/:id/recommendations', (req: Request, res: Response) => {
  const need = deliveryNeeds.find((n) => n.deliveryNeedId === req.params.id);
  if (!need) return err(res, req, 404, 'NOT_FOUND', 'Delivery need not found.');

  // Transition: CREATED → PENDING_MATCH
  need.status = 'PENDING_MATCH';

  const results = generateRecommendations(employees, need.requiredSkills, need.startDate);

  // Transition: PENDING_MATCH → MATCHED
  need.status = 'MATCHED';

  res.json({
    deliveryNeedId: need.deliveryNeedId,
    generatedAt: new Date().toISOString(),
    status: 'COMPLETED',
    skillSlots: results,
  });
});

// GET /api/v1/delivery-needs/:id/recommendations
squadsRouter.get('/delivery-needs/:id/recommendations', (req: Request, res: Response) => {
  const need = deliveryNeeds.find((n) => n.deliveryNeedId === req.params.id);
  if (!need) return err(res, req, 404, 'NOT_FOUND', 'Delivery need not found.');

  const results = generateRecommendations(employees, need.requiredSkills, need.startDate);

  res.json({
    deliveryNeedId: need.deliveryNeedId,
    generatedAt: new Date().toISOString(),
    status: 'COMPLETED',
    skillSlots: results,
  });
});

// GET /api/v1/candidates/:employeeId  (FR-CP-001–005)
squadsRouter.get('/candidates/:employeeId', (req: Request, res: Response) => {
  const emp = employees.find((e) => e.employeeId === req.params.employeeId);
  if (!emp) return err(res, req, 404, 'NOT_FOUND', 'Candidate not found.');

  const activeProjects = squads.flatMap((sq) =>
    sq.assignments
      .filter((a) => a.candidateId === emp.employeeId)
      .map((a) => ({
        squadId: sq.squadId,
        project: deliveryNeeds.find((n) => n.deliveryNeedId === sq.deliveryNeedId)?.title || '',
        allocationPercent: a.allocationPercent,
        endDate: null,
      }))
  );

  res.json({
    employeeId: emp.employeeId,
    name: emp.name,
    role: emp.role,
    skills: emp.skills.map((s) => ({ name: s.name, level: s.level })),
    availability: {
      status: emp.availabilityStatus,
      availableFrom: emp.availableFrom,
      currentAllocationPercentage: emp.currentAllocationPercentage,
      availableCapacityPercentage: 100 - emp.currentAllocationPercentage,
    },
    activeProjects,
  });
});

// POST /api/v1/delivery-needs/:id/squad  (FR-SQ-001–010)
squadsRouter.post('/delivery-needs/:id/squad', (req: Request, res: Response) => {
  const need = deliveryNeeds.find((n) => n.deliveryNeedId === req.params.id);
  if (!need) return err(res, req, 404, 'NOT_FOUND', 'Delivery need not found.');

  const { confirmedBy, notes, assignments } = req.body;

  if (!confirmedBy) return err(res, req, 400, 'VALIDATION_ERROR', 'confirmedBy is required.');
  if (!assignments || !Array.isArray(assignments) || assignments.length === 0) return err(res, req, 400, 'VALIDATION_ERROR', 'assignments array is required.');

  // Validate all assignments before writing any (FR-SQ-007, FR-SQ-008)
  for (const a of assignments) {
    if (a.allocationPercent < 1 || a.allocationPercent > 100) return err(res, req, 400, 'VALIDATION_ERROR', 'allocationPercent must be between 1 and 100.');
    const emp = employees.find((e) => e.employeeId === a.candidateId);
    if (!emp) return err(res, req, 404, 'NOT_FOUND', `Candidate ${a.candidateId} not found.`);
    if (emp.availabilityStatus === 'UNAVAILABLE' || emp.availabilityStatus === 'ON_LEAVE') return err(res, req, 409, 'CONFLICT', `Candidate ${a.candidateId} is no longer available.`);
  }

  // Block duplicate squad unless DISBANDED (FR-SQ-010)
  const existing = squads.find((s) => s.deliveryNeedId === need.deliveryNeedId && s.status !== 'DISBANDED');
  if (existing) return err(res, req, 409, 'CONFLICT', 'A squad already exists for this delivery need.');

  const coveredSkills = new Set(assignments.map((a: { skill: string }) => a.skill?.toLowerCase()));
  const allCovered = need.requiredSkills.every((s) => coveredSkills.has(s.skill.toLowerCase()));
  const squadStatus = allCovered ? 'ASSEMBLED' as const : 'PARTIALLY_ASSEMBLED' as const;

  const squad = {
    squadId: nextSquadId(),
    deliveryNeedId: need.deliveryNeedId,
    status: squadStatus,
    confirmedBy,
    notes,
    assembledAt: new Date().toISOString(),
    assignments,
  };

  squads.push(squad);

  // State transition (FR-SQ-002 / FR-SQ-003)
  need.status = squadStatus === 'ASSEMBLED' ? 'ASSEMBLED' : 'ASSEMBLING';

  // Atomic allocation update (NFR-DI-003)
  for (const a of assignments) {
    const emp = employees.find((e) => e.employeeId === a.candidateId)!;
    emp.currentAllocationPercentage += a.allocationPercent;
    if (emp.currentAllocationPercentage >= 80) emp.availabilityStatus = 'ALLOCATED';
    else if (emp.currentAllocationPercentage > 0) emp.availabilityStatus = 'PARTIALLY_AVAILABLE';
  }

  res.status(201).json({
    squadId: squad.squadId,
    deliveryNeedId: squad.deliveryNeedId,
    status: squad.status,
    memberCount: assignments.length,
    assembledAt: squad.assembledAt,
    confirmedBy: squad.confirmedBy,
  });
});
