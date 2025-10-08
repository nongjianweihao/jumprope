import { db } from '../db';
import type { FitnessTestResult } from '../../types/models';

export const testsRepo = {
  async upsert(result: FitnessTestResult) {
    await db.tests.put(result);
    return result;
  },
  async listByStudent(studentId: string) {
    return db.tests.where('studentId').equals(studentId).sortBy('date');
  },
  async get(id: string) {
    return db.tests.get(id);
  },
  async remove(id: string) {
    return db.tests.delete(id);
  }
};
