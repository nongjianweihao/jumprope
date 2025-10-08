import { db } from '../db';
import type { TrainingTemplate, Period } from '../../types/models';

/**
 * Repository for managing training templates
 * Provides CRUD operations and filtering capabilities
 */
export const templatesRepo = {
  /**
   * Create or update a training template
   * @param template - The template to save
   * @returns The saved template
   */
  async upsert(template: TrainingTemplate) {
    await db.templates.put(template);
    return template;
  },

  /**
   * Create or update a training template (alias for upsert)
   * @param template - The template to save
   * @returns The saved template
   */
  async save(template: TrainingTemplate) {
    return this.upsert(template);
  },

  /**
   * Get all training templates
   * @returns Array of all templates
   */
  async list() {
    return db.templates.toArray();
  },

  /**
   * Get all training templates (alias for list)
   * @returns Array of all templates
   */
  async getAll() {
    return this.list();
  },

  /**
   * Get a single template by ID
   * @param id - The template ID
   * @returns The template or undefined if not found
   */
  async get(id: string) {
    return db.templates.get(id);
  },

  /**
   * Get a single template by ID (alias for get)
   * @param id - The template ID
   * @returns The template or undefined if not found
   */
  async findById(id: string) {
    return this.get(id);
  },

  /**
   * Get templates by training period
   * @param period - The training period to filter by
   * @returns Array of templates matching the period
   */
  async listByPeriod(period: Period) {
    return db.templates.where('period').equals(period).toArray();
  },

  /**
   * Delete a template by ID
   * @param id - The template ID to delete
   * @returns void
   */
  async remove(id: string) {
    return db.templates.delete(id);
  },

  /**
   * Delete a template by ID (alias for remove)
   * @param id - The template ID to delete
   * @returns void
   */
  async delete(id: string) {
    return this.remove(id);
  },

  /**
   * Check if a template exists
   * @param id - The template ID to check
   * @returns true if the template exists, false otherwise
   */
  async exists(id: string) {
    const template = await this.get(id);
    return template !== undefined;
  },

  /**
   * Get the count of all templates
   * @returns The total number of templates
   */
  async count() {
    return db.templates.count();
  }
};
