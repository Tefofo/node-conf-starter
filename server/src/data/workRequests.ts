import { SkillLevel, Urgency } from './employees.js';

export interface SkillSlot {
  skill: string;
  level: SkillLevel;
  quantity: number;
}

export interface DeliveryNeed {
  deliveryNeedId: string;
  title: string;
  description: string;
  urgency: Urgency;
  startDate: string;
  durationWeeks: number;
  requiredSkills: SkillSlot[];
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface Squad {
  squadId: string;
  deliveryNeedId: string;
  status: 'ASSEMBLED' | 'PARTIALLY_ASSEMBLED' | 'DISBANDED';
  confirmedBy: string;
  notes?: string;
  assembledAt: string;
  assignments: SquadAssignment[];
}

export interface SquadAssignment {
  candidateId: string;
  skill: string;
  agreedStartDate: string;
  allocationPercent: number;
}

// In-memory stores
export const deliveryNeeds: DeliveryNeed[] = [];
export const squads: Squad[] = [];

let needCounter = 1;
let squadCounter = 1;

export function nextDeliveryNeedId(): string {
  return `DN-${String(needCounter++).padStart(5, '0')}`;
}

export function nextSquadId(): string {
  return `SQ-${String(squadCounter++).padStart(5, '0')}`;
}
