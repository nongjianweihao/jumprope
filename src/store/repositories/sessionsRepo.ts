import { db } from '../db';
import type { SessionRecord } from '../../types/models';

/**
 * Repository for managing training session records
 * Provides CRUD operations and session-specific functionality
 */
export const sessionsRepo = {
  /**
   * Create or update a session record
   * @param session - The session to save
   * @returns The saved session
   */
  async upsert(session: SessionRecord) {
    await db.sessions.put(session);
    return session;
  },

  /**
   * Create or update a session record (alias for upsert)
   * @param session - The session to save
   * @returns The saved session
   */
  async save(session: SessionRecord) {
    return this.upsert(session);
  },

  /**
   * Get all sessions for a specific class
   * @param classId - The class ID
   * @returns Array of sessions for the class, sorted by date (newest first)
   */
  async listByClass(classId: string) {
    return db.sessions.where('classId').equals(classId).reverse().sortBy('date');
  },

  /**
   * Get a single session by ID
   * @param id - The session ID
   * @returns The session or undefined if not found
   */
  async get(id: string) {
    return db.sessions.get(id);
  },

  /**
   * Get a single session by ID (alias for get)
   * @param id - The session ID
   * @returns The session or undefined if not found
   */
  async findById(id: string) {
    return this.get(id);
  },

  /**
   * Delete a session by ID
   * @param id - The session ID to delete
   * @returns void
   */
  async remove(id: string) {
    return db.sessions.delete(id);
  },

  /**
   * Delete a session by ID (alias for remove)
   * @param id - The session ID to delete
   * @returns void
   */
  async delete(id: string) {
    return this.remove(id);
  },

  /**
   * Get all sessions
   * @returns Array of all sessions
   */
  async list() {
    return db.sessions.toArray();
  },

  /**
   * Get all sessions (alias for list)
   * @returns Array of all sessions
   */
  async getAll() {
    return this.list();
  },

  /**
   * Close a session (mark as completed)
   * @param sessionId - The session ID to close
   * @returns void
   */
  async closeSession(sessionId: string) {
    await db.sessions.update(sessionId, { closed: true });
  },

  /**
   * Get closed sessions for a class
   * @param classId - The class ID
   * @returns Array of closed sessions for the class
   */
  async listClosedByClass(classId: string) {
    return db.sessions
      .where('classId')
      .equals(classId)
      .and(session => session.closed === true)
      .reverse()
      .sortBy('date');
  },

  /**
   * Get open (active) sessions for a class
   * @param classId - The class ID
   * @returns Array of open sessions for the class
   */
  async listOpenByClass(classId: string) {
    return db.sessions
      .where('classId')
      .equals(classId)
      .and(session => session.closed !== true)
      .reverse()
      .sortBy('date');
  },

  /**
   * Check if a session exists
   * @param id - The session ID to check
   * @returns true if the session exists, false otherwise
   */
  async exists(id: string) {
    const session = await this.get(id);
    return session !== undefined;
  },

  /**
   * Get the count of all sessions
   * @returns The total number of sessions
   */
  async count() {
    return db.sessions.count();
  },

  /**
   * Get the count of sessions for a specific class
   * @param classId - The class ID
   * @returns The total number of sessions for the class
   */
  async countByClass(classId: string) {
    return db.sessions.where('classId').equals(classId).count();
  }
};
