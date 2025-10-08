import Dexie, { Table } from 'dexie';
import type {
  Student,
  ClassEntity,
  TrainingTemplate,
  SessionRecord,
  FitnessTestResult,
  RankExamRecord,
  LessonPackage,
  PaymentRecord
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

  constructor() {
    super('jumpRopeDB');
    this.version(1).stores({
      students: 'id, name, currentRank',
      classes: 'id, name',
      templates: 'id, name, period',
      sessions: 'id, classId, date, closed',
      tests: 'id, studentId, quarter, date',
      rankExams: 'id, studentId, date',
      lessonPackages: 'id, studentId, purchasedAt',
      payments: 'id, studentId, paidAt'
    });
  }
}

export const db = new AppDB();
