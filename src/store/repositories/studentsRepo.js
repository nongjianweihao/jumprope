import { db } from '../db';
import { calcWallet } from './wallet';
export const studentsRepo = {
    async upsert(student) {
        await db.students.put(student);
        return student;
    },
    async list() {
        return db.students.toArray();
    },
    async get(id) {
        return db.students.get(id);
    },
    async remove(id) {
        return db.students.delete(id);
    },
    async wallet(studentId) {
        return calcWallet(studentId);
    }
};
