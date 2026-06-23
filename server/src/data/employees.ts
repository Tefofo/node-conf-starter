export type SkillLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'PRINCIPAL';
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AvailabilityStatus = 'AVAILABLE' | 'PARTIALLY_AVAILABLE' | 'ALLOCATED' | 'ON_LEAVE' | 'UNAVAILABLE';

export const SKILL_LEVEL_ORDINAL: Record<SkillLevel, number> = {
  JUNIOR: 1, MID: 2, SENIOR: 3, LEAD: 4, PRINCIPAL: 5,
};

export interface EmployeeSkill {
  name: string;
  level: SkillLevel;
}

export interface Employee {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  skills: EmployeeSkill[];
  availabilityStatus: AvailabilityStatus;
  currentAllocationPercentage: number;
  availableFrom: string | null;
}

export const employees: Employee[] = [
  {
    employeeId: 'E001',
    name: 'Sarah Williams',
    role: 'Solution Architect',
    department: 'Enterprise Architecture',
    skills: [
      { name: 'Solution Architecture', level: 'LEAD' },
      { name: 'Cloud Architecture', level: 'SENIOR' },
      { name: 'API Design', level: 'SENIOR' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 60,
    availableFrom: '2026-06-28',
  },
  {
    employeeId: 'E002',
    name: 'Thabo Mokoena',
    role: 'Senior Software Engineer',
    department: 'Digital Banking',
    skills: [
      { name: 'Java Development', level: 'SENIOR' },
      { name: 'Microservices', level: 'SENIOR' },
      { name: 'API Design', level: 'MID' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 40,
    availableFrom: '2026-07-01',
  },
  {
    employeeId: 'E003',
    name: 'Naledi Dlamini',
    role: 'Full Stack Developer',
    department: 'Digital Banking',
    skills: [
      { name: 'Java Development', level: 'MID' },
      { name: 'React Development', level: 'MID' },
      { name: 'QA Testing', level: 'JUNIOR' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 0,
    availableFrom: null,
  },
  {
    employeeId: 'E004',
    name: 'Ayanda Zulu',
    role: 'QA Lead',
    department: 'Quality Engineering',
    skills: [
      { name: 'QA Testing', level: 'LEAD' },
      { name: 'QA Automation', level: 'SENIOR' },
      { name: 'Performance Testing', level: 'MID' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 10,
    availableFrom: null,
  },
  {
    employeeId: 'E005',
    name: 'Lerato Molefe',
    role: 'Delivery Manager',
    department: 'Project Delivery',
    skills: [
      { name: 'Agile Delivery', level: 'LEAD' },
      { name: 'Stakeholder Management', level: 'SENIOR' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 50,
    availableFrom: '2026-07-07',
  },
  {
    employeeId: 'E006',
    name: 'Ravi Pillay',
    role: 'DevOps Engineer',
    department: 'Platform Engineering',
    skills: [
      { name: 'Cloud Architecture', level: 'MID' },
      { name: 'DevOps', level: 'SENIOR' },
      { name: 'Kubernetes', level: 'MID' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 30,
    availableFrom: '2026-07-01',
  },
  {
    employeeId: 'E007',
    name: 'James Okafor',
    role: 'Senior Java Developer',
    department: 'Digital Banking',
    skills: [
      { name: 'Java Development', level: 'SENIOR' },
      { name: 'Microservices', level: 'MID' },
      { name: 'SQL', level: 'MID' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 0,
    availableFrom: null,
  },
  {
    employeeId: 'E008',
    name: 'Fatima Mahomed',
    role: 'UX Designer',
    department: 'Design Studio',
    skills: [
      { name: 'UX Design', level: 'SENIOR' },
      { name: 'User Research', level: 'MID' },
      { name: 'Prototyping', level: 'SENIOR' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 15,
    availableFrom: null,
  },
  {
    employeeId: 'E009',
    name: 'Nomsa Khumalo',
    role: 'Business Analyst',
    department: 'Strategy & Planning',
    skills: [
      { name: 'Requirements Analysis', level: 'SENIOR' },
      { name: 'Stakeholder Management', level: 'MID' },
      { name: 'Agile Delivery', level: 'MID' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 25,
    availableFrom: '2026-07-01',
  },
  {
    employeeId: 'E010',
    name: 'David Osei',
    role: 'Data Engineer',
    department: 'Data & Analytics',
    skills: [
      { name: 'Data Engineering', level: 'SENIOR' },
      { name: 'Python', level: 'SENIOR' },
      { name: 'SQL', level: 'LEAD' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 0,
    availableFrom: null,
  },
  {
    employeeId: 'E011',
    name: 'Zanele Mthembu',
    role: 'Cloud Architect',
    department: 'Platform Engineering',
    skills: [
      { name: 'Cloud Architecture', level: 'LEAD' },
      { name: 'Solution Architecture', level: 'SENIOR' },
      { name: 'Security Architecture', level: 'MID' },
    ],
    availabilityStatus: 'ALLOCATED',
    currentAllocationPercentage: 80,
    availableFrom: '2026-08-01',
  },
  {
    employeeId: 'E012',
    name: 'Priya Naidoo',
    role: 'Test Automation Engineer',
    department: 'Quality Engineering',
    skills: [
      { name: 'QA Automation', level: 'MID' },
      { name: 'QA Testing', level: 'MID' },
      { name: 'Performance Testing', level: 'JUNIOR' },
    ],
    availabilityStatus: 'ON_LEAVE',
    currentAllocationPercentage: 0,
    availableFrom: '2026-08-01',
  },
  {
    employeeId: 'E013',
    name: 'Bongani Sithole',
    role: 'Scrum Master',
    department: 'Project Delivery',
    skills: [
      { name: 'Agile Delivery', level: 'SENIOR' },
      { name: 'Facilitation', level: 'SENIOR' },
    ],
    availabilityStatus: 'PARTIALLY_AVAILABLE',
    currentAllocationPercentage: 45,
    availableFrom: '2026-07-14',
  },
  {
    employeeId: 'E014',
    name: 'David Green',
    role: 'Java Developer',
    department: 'Digital Banking',
    skills: [
      { name: 'Java Development', level: 'MID' },
      { name: 'React Development', level: 'JUNIOR' },
      { name: 'SQL', level: 'MID' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 20,
    availableFrom: null,
  },
  {
    employeeId: 'E015',
    name: 'Mandla Ndlovu',
    role: 'Backend Developer',
    department: 'Digital Banking',
    skills: [
      { name: 'Java Development', level: 'MID' },
      { name: 'Microservices', level: 'JUNIOR' },
      { name: 'API Design', level: 'MID' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 0,
    availableFrom: null,
  },
  {
    employeeId: 'E031',
    name: 'Luke Carter',
    role: 'Principal Architect',
    department: 'Enterprise Architecture',
    skills: [
      { name: 'Solution Architecture', level: 'PRINCIPAL' },
      { name: 'Cloud Architecture', level: 'LEAD' },
      { name: 'Security Architecture', level: 'SENIOR' },
    ],
    availabilityStatus: 'AVAILABLE',
    currentAllocationPercentage: 0,
    availableFrom: null,
  },
];
