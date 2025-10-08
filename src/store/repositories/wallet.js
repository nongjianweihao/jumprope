import { db } from '../db';
export async function calcWallet(studentId) {
    const packages = await db.lessonPackages.where('studentId').equals(studentId).toArray();
    const sessions = await db.sessions.toArray();
    const consumed = sessions.reduce((acc, session) => {
        const overrides = session.consumeOverrides?.find((c) => c.studentId === studentId);
        if (overrides) {
            return acc + overrides.consume;
        }
        const attended = session.attendance?.find((a) => a.studentId === studentId)?.present;
        if (attended) {
            return acc + (session.lessonConsume ?? 1);
        }
        return acc;
    }, 0);
    const totalPurchased = packages.reduce((acc, pkg) => acc + pkg.purchasedLessons, 0);
    return {
        studentId,
        totalPurchased,
        totalConsumed: consumed,
        remaining: totalPurchased - consumed
    };
}
