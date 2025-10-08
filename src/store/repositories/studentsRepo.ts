import { db } from '../db';
import type { LessonWallet, Student } from '../../types/models';
import { calcWallet } from './wallet';

export const studentsRepo = {
  async upsert(student: Student) {
    await db.students.put(student);
    return student;
  },
  async list() {
    return db.students.toArray();
  },
  async get(id: string) {
    return db.students.get(id);
  },
  async remove(id: string) {
    return db.students.delete(id);
  },
  async wallet(studentId: string): Promise<LessonWallet> {
    return calcWallet(studentId);
  }
};
