import { db } from '../db';
export const testsRepo = {
    async upsert(result) {
        await db.tests.put(result);
        return result;
    },
    async listByStudent(studentId) {
        return db.tests.where('studentId').equals(studentId).sortBy('date');
    },
    async get(id) {
        return db.tests.get(id);
    },
    async remove(id) {
        return db.tests.delete(id);
    }
};
