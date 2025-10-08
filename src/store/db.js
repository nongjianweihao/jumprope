import Dexie from 'dexie';
export class AppDB extends Dexie {
    students;
    classes;
    templates;
    sessions;
    tests;
    rankExams;
    lessonPackages;
    payments;
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
