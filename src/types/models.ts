export type ID = string;
export type ISODate = string;
export type Period = 'PREP' | 'SPEC' | 'COMP';
export type WindowSec = 10 | 20 | 30 | 60;
export type JumpMode = 'single' | 'double';
export type TrainingStage = 'BASIC' | 'IMPROVE' | 'ELITE' | 'COMPETE';
export type FitnessQuality =
  | 'speed'
  | 'power'
  | 'endurance'
  | 'coordination'
  | 'agility'
  | 'balance'
  | 'flexibility'
  | 'core'
  | 'accuracy';

export interface RankMove {
  id: ID;
  rank: number;
  name: string;
  tags?: string[];
  description?: string;
  criteria?: string;
}

export interface WarriorPathNode {
  id: ID;
  rank: number;
  title: string;
  moveIds: ID[];
  points: number;
}

export interface GameDrill {
  id: ID;
  name: string;
  qualityTags: FitnessQuality[];
  description?: string;
}

export interface TemplateBlock {
  id: ID;
  title: string;
  period: Period;
  durationMin?: number;
  drillIds?: ID[];
  rankMoveIds?: ID[];
  qualities?: FitnessQuality[];
  gameIds?: ID[];
  notes?: string;
}

export interface TrainingTemplate {
  id: ID;
  name: string;
  period: Period;
  weeks?: number;
  durationMinTotal?: number;
  blocks: TemplateBlock[];
  createdAt: ISODate;
}

export interface Drill {
  id: ID;
  name: string;
  stage: TrainingStage;
  qualities: FitnessQuality[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  equipment?: string[];
  durationMin?: number;
  description?: string;
  cues?: string[];
  progressions?: string[];
  gameable?: boolean;
}

export interface GameItem {
  id: ID;
  name: string;
  stage: TrainingStage;
  qualities: FitnessQuality[];
  minPlayers?: number;
  maxPlayers?: number;
  durationMin?: number;
  intensity?: 'low' | 'mid' | 'high';
  rules?: string;
  scoring?: string;
  safetyNotes?: string;
}

export interface TrainingPlanWeek {
  weekIndex: number;
  theme: string;
  blocks: Array<{
    title: string;
    durationMin?: number;
    drillIds?: ID[];
    gameIds?: ID[];
    notes?: string;
  }>;
}

export interface TrainingPlan {
  id: ID;
  name: string;
  stage: TrainingStage;
  weeks: number;
  schedule: TrainingPlanWeek[];
  createdAt: ISODate;
  remark?: string;
}

export interface Student {
  id: ID;
  name: string;
  gender?: 'M' | 'F';
  birth?: ISODate;
  guardian?: { name: string; phone?: string };
  joinDate?: ISODate;
  currentRank?: number;
  tags?: string[];
  pointsTotal?: number;
  badges?: string[];
  best30Single?: number;
}

export interface ClassEntity {
  id: ID;
  name: string;
  coachName: string;
  schedule?: string;
  templateId?: ID;
  studentIds: ID[];
}

export interface AttendanceItem {
  studentId: ID;
  present: boolean;
  remark?: string;
}

export interface SpeedRecord {
  id: ID;
  studentId: ID;
  mode: JumpMode;
  window: WindowSec;
  reps: number;
  date?: ISODate;
}

export interface FreestyleChallengeRecord {
  id: ID;
  studentId: ID;
  moveId: ID;
  passed: boolean;
  note?: string;
  date?: ISODate;
}

export interface TrainingNote {
  id: ID;
  studentId: ID;
  rating?: number;
  comments?: string;
  tags?: string[];
}

export interface SessionRecord {
  id: ID;
  classId: ID;
  date: ISODate;
  templateId?: ID;
  attendance: AttendanceItem[];
  speed: SpeedRecord[];
  freestyle: FreestyleChallengeRecord[];
  notes: TrainingNote[];
  closed: boolean;
  lessonConsume?: number;
  consumeOverrides?: Array<{ studentId: ID; consume: number }>;
  highlights?: string[];
  pointEvents?: PointEvent[];
}

export type PointEventType = 'attendance' | 'pr' | 'freestyle_pass' | 'coach_bonus' | 'quest_complete';

export interface PointEvent {
  id: ID;
  sessionId: ID;
  studentId: ID;
  type: PointEventType;
  points: number;
  reason?: string;
  createdAt: ISODate;
}

export interface FitnessTestItem {
  id: ID;
  name: string;
  quality: FitnessQuality;
  unit: 'count' | 'cm' | 's' | 'grade';
}

export interface FitnessTestResult {
  id: ID;
  studentId: ID;
  quarter: string;
  date: ISODate;
  items: Array<{ itemId: ID; value: number }>;
  radar: Record<FitnessQuality, number>;
}

export interface RankExamRecord {
  id: ID;
  studentId: ID;
  date: ISODate;
  fromRank: number;
  toRank: number;
  passed: boolean;
  notes?: string;
}

export interface LessonPackage {
  id: ID;
  studentId: ID;
  purchasedLessons: number;
  price: number;
  unitPrice?: number;
  purchasedAt: ISODate;
  remark?: string;
}

export interface PaymentRecord {
  id: ID;
  studentId: ID;
  packageId: ID;
  amount: number;
  method?: 'cash' | 'wechat' | 'alipay' | 'card' | 'other';
  paidAt: ISODate;
}

export interface LessonWallet {
  studentId: ID;
  totalPurchased: number;
  totalConsumed: number;
  remaining: number;
}

export interface Benchmark {
  id: ID;
  quality: FitnessQuality;
  ageMin: number;
  ageMax: number;
  gender?: 'M' | 'F' | 'all';
  unit: 'count' | 'cm' | 's' | 'grade';
  p25: number;
  p50: number;
  p75: number;
}

export interface Recommendation {
  id: ID;
  studentId: ID;
  createdAt: ISODate;
  reason: string;
  templateId: ID;
  applied: boolean;
}
