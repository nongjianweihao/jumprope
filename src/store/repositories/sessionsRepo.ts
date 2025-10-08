import { db } from '../db';
import type { SessionRecord } from '../../types/models';

export const sessionsRepo = {
  async upsert(session: SessionRecord) {
    await db.sessions.put(session);
    return session;
  },
  async listByClass(classId: string) {
    const rows = await db.sessions.where('classId').equals(classId).sortBy('date');
    return rows.reverse();
  },
  async get(id: string) {
    return db.sessions.get(id);
  },
  async remove(id: string) {
    return db.sessions.delete(id);
  }
};
