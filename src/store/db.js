import Dexie from 'dexie';
export class AppDB extends Dexie {
    constructor() {
        super('jumpRopeDB');
        Object.defineProperty(this, "students", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "classes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rankExams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lessonPackages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "payments", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
