import { db } from '../db';
export const sessionsRepo = {
    async upsert(session) {
        await db.sessions.put(session);
        return session;
    },
    async listByClass(classId) {
        return db.sessions.where('classId').equals(classId).reverse().sortBy('date');
    },
    async get(id) {
        return db.sessions.get(id);
    },
    async remove(id) {
        return db.sessions.delete(id);
    }
};
