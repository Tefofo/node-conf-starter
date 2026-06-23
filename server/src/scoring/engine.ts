import { Employee, SkillLevel, SKILL_LEVEL_ORDINAL } from '../data/employees.js';
import { SkillSlot } from '../data/workRequests.js';

export interface ScoreBreakdown {
  skillMatch: number;
  availability: number;
  workload: number;
  roleAlignment: number;
}

export interface ScoredCandidate {
  employeeId: string;
  name: string;
  role: string;
  compositeScore: number;
  scoreBreakdown: ScoreBreakdown;
  availableFrom: string | null;
  currentAllocationPercentage: number;
}

export interface SkillSlotResult {
  skill: string;
  level: SkillLevel;
  quantityRequired: number;
  candidates: ScoredCandidate[];
}

function scoreSkillMatch(employee: Employee, slot: SkillSlot): number {
  const empSkill = employee.skills.find(
    (s) => s.name.toLowerCase() === slot.skill.toLowerCase()
  );
  if (!empSkill) return 0;
  const empOrdinal = SKILL_LEVEL_ORDINAL[empSkill.level];
  const reqOrdinal = SKILL_LEVEL_ORDINAL[slot.level];
  if (empOrdinal < reqOrdinal) return 0;
  if (empOrdinal === reqOrdinal) return 100;
  if (empOrdinal === reqOrdinal + 1) return 90;
  return 80; // overqualified by 2+ levels
}

function scoreAvailability(employee: Employee, startDate: string): number {
  if (employee.availabilityStatus === 'AVAILABLE') return 100;
  if (employee.availabilityStatus === 'ON_LEAVE' || employee.availabilityStatus === 'UNAVAILABLE') return 0;
  if (!employee.availableFrom) return 70;
  const available = new Date(employee.availableFrom);
  const needed = new Date(startDate);
  if (available <= needed) return 100;
  const daysLate = (available.getTime() - needed.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(100 - daysLate * 5));
}

function scoreWorkload(employee: Employee): number {
  return Math.max(0, 100 - employee.currentAllocationPercentage);
}

function scoreRoleAlignment(employee: Employee, slot: SkillSlot): number {
  const roleLower = employee.role.toLowerCase();
  const skillLower = slot.skill.toLowerCase();
  // Simple word overlap heuristic
  const skillWords = skillLower.split(/\s+/);
  const matchCount = skillWords.filter((w) => roleLower.includes(w)).length;
  if (matchCount === 0) return 30;
  return Math.min(100, 30 + Math.round((matchCount / skillWords.length) * 70));
}

export function computeScore(breakdown: ScoreBreakdown): number {
  return Math.round(
    breakdown.skillMatch * 0.4 +
    breakdown.availability * 0.3 +
    breakdown.workload * 0.2 +
    breakdown.roleAlignment * 0.1
  );
}

export function generateRecommendations(
  employees: Employee[],
  skillSlots: SkillSlot[],
  startDate: string
): SkillSlotResult[] {
  return skillSlots.map((slot) => {
    const eligible = employees.filter((emp) => {
      if (emp.availabilityStatus === 'ON_LEAVE' || emp.availabilityStatus === 'UNAVAILABLE') return false;
      const empSkill = emp.skills.find((s) => s.name.toLowerCase() === slot.skill.toLowerCase());
      if (!empSkill) return false;
      return SKILL_LEVEL_ORDINAL[empSkill.level] >= SKILL_LEVEL_ORDINAL[slot.level];
    });

    const scored: ScoredCandidate[] = eligible.map((emp) => {
      const breakdown: ScoreBreakdown = {
        skillMatch: scoreSkillMatch(emp, slot),
        availability: scoreAvailability(emp, startDate),
        workload: scoreWorkload(emp),
        roleAlignment: scoreRoleAlignment(emp, slot),
      };
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        compositeScore: computeScore(breakdown),
        scoreBreakdown: breakdown,
        availableFrom: emp.availableFrom,
        currentAllocationPercentage: emp.currentAllocationPercentage,
      };
    });

    scored.sort((a, b) => b.compositeScore - a.compositeScore);

    return {
      skill: slot.skill,
      level: slot.level,
      quantityRequired: slot.quantity,
      candidates: scored.slice(0, 5),
    };
  });
}
