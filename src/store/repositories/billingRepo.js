import { db } from '../db';
import { calcWallet } from './wallet';
/**
 * Repository for managing billing and financial operations
 * Provides operations for lesson packages, payments, and financial KPIs
 */
export const billingRepo = {
    /**
     * Add a lesson package with its associated payment record
     * Both records are added in a single transaction
     * @param pkg - The lesson package to add
     * @param payment - The payment record to add
     * @returns void
     */
    async addPackage(pkg, payment) {
        await db.transaction('rw', db.lessonPackages, db.payments, async () => {
            await db.lessonPackages.put(pkg);
            await db.payments.put(payment);
        });
    },
    /**
     * Get all payment records for a specific student
     * @param studentId - The student ID
     * @returns Array of payment records sorted by payment date
     */
    async paymentsByStudent(studentId) {
        return db.payments.where('studentId').equals(studentId).sortBy('paidAt');
    },
    /**
     * Get all lesson packages for a specific student
     * @param studentId - The student ID
     * @returns Array of lesson packages sorted by purchase date
     */
    async packagesByStudent(studentId) {
        return db.lessonPackages.where('studentId').equals(studentId).sortBy('purchasedAt');
    },
    /**
     * Get the lesson wallet for a student
     * @param studentId - The student ID
     * @returns The student's lesson wallet with purchased, consumed, and remaining lessons
     */
    async wallet(studentId) {
        return calcWallet(studentId);
    },
    /**
     * Get a single lesson package by ID
     * @param id - The package ID
     * @returns The lesson package or undefined if not found
     */
    async getPackage(id) {
        return db.lessonPackages.get(id);
    },
    /**
     * Get a single payment record by ID
     * @param id - The payment ID
     * @returns The payment record or undefined if not found
     */
    async getPayment(id) {
        return db.payments.get(id);
    },
    /**
     * Get all lesson packages
     * @returns Array of all lesson packages
     */
    async listAllPackages() {
        return db.lessonPackages.toArray();
    },
    /**
     * Get all payment records
     * @returns Array of all payment records
     */
    async listAllPayments() {
        return db.payments.toArray();
    },
    /**
     * Calculate and return key financial performance indicators
     * @returns Object containing totalStudents, totalRevenue, consumed, remaining, arpu, and consumeRate
     */
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
    },
    /**
     * Get payment records by date range
     * @param startDate - Start date (ISO format)
     * @param endDate - End date (ISO format)
     * @returns Array of payment records within the date range
     */
    async paymentsByDateRange(startDate, endDate) {
        return db.payments
            .where('paidAt')
            .between(startDate, endDate, true, true)
            .sortBy('paidAt');
    },
    /**
     * Get total revenue for a date range
     * @param startDate - Start date (ISO format)
     * @param endDate - End date (ISO format)
     * @returns Total revenue amount
     */
    async revenueByDateRange(startDate, endDate) {
        const payments = await this.paymentsByDateRange(startDate, endDate);
        return payments.reduce((sum, p) => sum + p.amount, 0);
    },
    /**
     * Delete a lesson package by ID
     * Note: This does not delete the associated payment record
     * @param id - The package ID to delete
     * @returns void
     */
    async removePackage(id) {
        return db.lessonPackages.delete(id);
    },
    /**
     * Delete a payment record by ID
     * @param id - The payment ID to delete
     * @returns void
     */
    async removePayment(id) {
        return db.payments.delete(id);
    }
};
