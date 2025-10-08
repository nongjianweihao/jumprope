import Dexie, { Table } from 'dexie';
import type {
  Student,
  ClassEntity,
  TrainingTemplate,
  SessionRecord,
  FitnessTestResult,
  RankExamRecord,
  LessonPackage,
  PaymentRecord,
  Drill,
  GameItem,
  TrainingPlan
} from '../types/models';

export class AppDB extends Dexie {
  students!: Table<Student, string>;
  classes!: Table<ClassEntity, string>;
  templates!: Table<TrainingTemplate, string>;
  sessions!: Table<SessionRecord, string>;
  tests!: Table<FitnessTestResult, string>;
  rankExams!: Table<RankExamRecord, string>;
  lessonPackages!: Table<LessonPackage, string>;
  payments!: Table<PaymentRecord, string>;
  drills!: Table<Drill, string>;
  games!: Table<GameItem, string>;
  plans!: Table<TrainingPlan, string>;

  constructor() {
    super('jumpRopeDB');
    this.version(2).stores({
      students: 'id, name, currentRank',
      classes: 'id, name',
      templates: 'id, name, period',
      sessions: 'id, classId, date, closed',
      tests: 'id, studentId, quarter, date',
      rankExams: 'id, studentId, date',
      lessonPackages: 'id, studentId, purchasedAt',
      payments: 'id, studentId, paidAt',
      drills: 'id, name, stage, *qualities',
      games: 'id, name, stage, *qualities',
      plans: 'id, name, stage, weeks'
    });
  }
}

export const db = new AppDB();
