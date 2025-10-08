import { db } from '../db';
import type { LessonWallet, Student } from '../../types/models';
import { calcWallet } from './wallet';

/**
 * Repository for managing student records
 * Provides CRUD operations and student-specific functionality
 */
export const studentsRepo = {
  /**
   * Create or update a student record
   * @param student - The student to save
   * @returns The saved student
   */
  async upsert(student: Student) {
    await db.students.put(student);
    return student;
  },

  /**
   * Create or update a student record (alias for upsert)
   * @param student - The student to save
   * @returns The saved student
   */
  async save(student: Student) {
    return this.upsert(student);
  },

  /**
   * Get all students
   * @returns Array of all students
   */
  async list() {
    return db.students.toArray();
  },

  /**
   * Get all students (alias for list)
   * @returns Array of all students
   */
  async getAll() {
    return this.list();
  },

  /**
   * Get a single student by ID
   * @param id - The student ID
   * @returns The student or undefined if not found
   */
  async get(id: string) {
    return db.students.get(id);
  },

  /**
   * Get a single student by ID (alias for get)
   * @param id - The student ID
   * @returns The student or undefined if not found
   */
  async findById(id: string) {
    return this.get(id);
  },

  /**
   * Delete a student by ID
   * @param id - The student ID to delete
   * @returns void
   */
  async remove(id: string) {
    return db.students.delete(id);
  },

  /**
   * Delete a student by ID (alias for remove)
   * @param id - The student ID to delete
   * @returns void
   */
  async delete(id: string) {
    return this.remove(id);
  },

  /**
   * Get the lesson wallet for a student
   * @param studentId - The student ID
   * @returns The student's lesson wallet
   */
  async wallet(studentId: string): Promise<LessonWallet> {
    return calcWallet(studentId);
  },

  /**
   * Update student's rank
   * @param studentId - The student ID
   * @param rank - The new rank
   * @returns void
   */
  async updateRank(studentId: string, rank: number) {
    await db.students.update(studentId, { currentRank: rank });
  },

  /**
   * Add points to a student's total
   * @param studentId - The student ID
   * @param points - Points to add
   * @returns The new total points
   */
  async addPoints(studentId: string, points: number) {
    const student = await this.get(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    const newTotal = (student.pointsTotal ?? 0) + points;
    await db.students.update(studentId, { pointsTotal: newTotal });
    return newTotal;
  },

  /**
   * Add a badge to a student
   * @param studentId - The student ID
   * @param badge - The badge to add
   * @returns void
   */
  async addBadge(studentId: string, badge: string) {
    const student = await this.get(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    const badges = student.badges ?? [];
    if (!badges.includes(badge)) {
      await db.students.update(studentId, { badges: [...badges, badge] });
    }
  },

  /**
   * Get students by rank
   * @param rank - The rank to filter by
   * @returns Array of students with the specified rank
   */
  async listByRank(rank: number) {
    return db.students.where('currentRank').equals(rank).toArray();
  },

  /**
   * Check if a student exists
   * @param id - The student ID to check
   * @returns true if the student exists, false otherwise
   */
  async exists(id: string) {
    const student = await this.get(id);
    return student !== undefined;
  },

  /**
   * Get the count of all students
   * @returns The total number of students
   */
  async count() {
    return db.students.count();
  }
};
