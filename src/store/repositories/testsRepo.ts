import { db } from '../db';
import type { FitnessTestResult } from '../../types/models';

/**
 * Repository for managing fitness test results
 * Provides CRUD operations and test-specific functionality
 */
export const testsRepo = {
  /**
   * Create or update a fitness test result
   * @param result - The test result to save
   * @returns The saved test result
   */
  async upsert(result: FitnessTestResult) {
    await db.tests.put(result);
    return result;
  },

  /**
   * Create or update a fitness test result (alias for upsert)
   * @param result - The test result to save
   * @returns The saved test result
   */
  async save(result: FitnessTestResult) {
    return this.upsert(result);
  },

  /**
   * Get all test results for a specific student
   * @param studentId - The student ID
   * @returns Array of test results for the student, sorted by date
   */
  async listByStudent(studentId: string) {
    return db.tests.where('studentId').equals(studentId).sortBy('date');
  },

  /**
   * Get a single test result by ID
   * @param id - The test result ID
   * @returns The test result or undefined if not found
   */
  async get(id: string) {
    return db.tests.get(id);
  },

  /**
   * Get a single test result by ID (alias for get)
   * @param id - The test result ID
   * @returns The test result or undefined if not found
   */
  async findById(id: string) {
    return this.get(id);
  },

  /**
   * Delete a test result by ID
   * @param id - The test result ID to delete
   * @returns void
   */
  async remove(id: string) {
    return db.tests.delete(id);
  },

  /**
   * Delete a test result by ID (alias for remove)
   * @param id - The test result ID to delete
   * @returns void
   */
  async delete(id: string) {
    return this.remove(id);
  },

  /**
   * Get all test results
   * @returns Array of all test results
   */
  async list() {
    return db.tests.toArray();
  },

  /**
   * Get all test results (alias for list)
   * @returns Array of all test results
   */
  async getAll() {
    return this.list();
  },

  /**
   * Get test results for a specific quarter
   * @param quarter - The quarter identifier (e.g., "2025Q1")
   * @returns Array of test results for the quarter
   */
  async listByQuarter(quarter: string) {
    return db.tests.where('quarter').equals(quarter).sortBy('date');
  },

  /**
   * Get the latest test result for a student
   * @param studentId - The student ID
   * @returns The most recent test result or undefined if none exist
   */
  async getLatestByStudent(studentId: string) {
    const tests = await this.listByStudent(studentId);
    return tests.at(-1);
  },

  /**
   * Check if a test result exists
   * @param id - The test result ID to check
   * @returns true if the test result exists, false otherwise
   */
  async exists(id: string) {
    const test = await this.get(id);
    return test !== undefined;
  },

  /**
   * Get the count of all test results
   * @returns The total number of test results
   */
  async count() {
    return db.tests.count();
  },

  /**
   * Get the count of test results for a specific student
   * @param studentId - The student ID
   * @returns The total number of test results for the student
   */
  async countByStudent(studentId: string) {
    return db.tests.where('studentId').equals(studentId).count();
  }
};
