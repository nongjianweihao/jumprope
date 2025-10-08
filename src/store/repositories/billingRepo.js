import { db } from '../db';
import { calcWallet } from './wallet';
export const billingRepo = {
    async addPackage(pkg, payment) {
        await db.transaction('rw', db.lessonPackages, db.payments, async () => {
            await db.lessonPackages.put(pkg);
            await db.payments.put(payment);
        });
    },
    async paymentsByStudent(studentId) {
        return db.payments.where('studentId').equals(studentId).sortBy('paidAt');
    },
    async packagesByStudent(studentId) {
        return db.lessonPackages.where('studentId').equals(studentId).sortBy('purchasedAt');
    },
    async wallet(studentId) {
        return calcWallet(studentId);
    },
    async financeKpis() {
        const [students, payments, walletMap] = await Promise.all([
            db.students.toArray(),
            db.payments.toArray(),
            (async () => {
                const map = new Map();
                for (const student of await db.students.toArray()) {
                    map.set(student.id, await calcWallet(student.id));
                }
                return map;
            })()
        ]);
        const totalStudents = students.length;
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const consumed = Array.from(walletMap.values()).reduce((sum, w) => sum + w.totalConsumed, 0);
        const remaining = Array.from(walletMap.values()).reduce((sum, w) => sum + w.remaining, 0);
        const totalPurchased = consumed + remaining;
        const arpu = totalStudents ? totalRevenue / totalStudents : 0;
        const consumeRate = totalPurchased ? (consumed / totalPurchased) * 100 : 0;
        return { totalStudents, totalRevenue, consumed, remaining, arpu, consumeRate };
    }
};
