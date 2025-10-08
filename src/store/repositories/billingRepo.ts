import { db } from '../db';
import type { LessonPackage, LessonWallet, PaymentRecord } from '../../types/models';
import { calcWallet } from './wallet';

export const billingRepo = {
  async addPackage(pkg: LessonPackage, payment: PaymentRecord) {
    await db.transaction('rw', db.lessonPackages, db.payments, async () => {
      await db.lessonPackages.put(pkg);
      await db.payments.put(payment);
    });
  },
  async paymentsByStudent(studentId: string) {
    return db.payments.where('studentId').equals(studentId).sortBy('paidAt');
  },
  async packagesByStudent(studentId: string) {
    return db.lessonPackages.where('studentId').equals(studentId).sortBy('purchasedAt');
  },
  async wallet(studentId: string): Promise<LessonWallet> {
    return calcWallet(studentId);
  },
  async financeKpis() {
    const [students, payments, walletMap] = await Promise.all([
      db.students.toArray(),
      db.payments.toArray(),
      (async () => {
        const map = new Map<string, LessonWallet>();
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
