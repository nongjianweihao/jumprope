import { db } from '../db';
/**
 * Repository for managing class entities
 * Provides CRUD operations and class-specific functionality
 */
export const classesRepo = {
    /**
     * Create or update a class entity
     * @param entity - The class entity to save
     * @returns The saved class entity
     */
    async upsert(entity) {
        await db.classes.put(entity);
        return entity;
    },
    /**
     * Create or update a class entity (alias for upsert)
     * @param entity - The class entity to save
     * @returns The saved class entity
     */
    async save(entity) {
        return this.upsert(entity);
    },
    /**
     * Get all classes
     * @returns Array of all classes
     */
    async list() {
        return db.classes.toArray();
    },
    /**
     * Get all classes (alias for list)
     * @returns Array of all classes
     */
    async getAll() {
        return this.list();
    },
    /**
     * Get a single class by ID
     * @param id - The class ID
     * @returns The class or undefined if not found
     */
    async get(id) {
        return db.classes.get(id);
    },
    /**
     * Get a single class by ID (alias for get)
     * @param id - The class ID
     * @returns The class or undefined if not found
     */
    async findById(id) {
        return this.get(id);
    },
    /**
     * Delete a class by ID
     * @param id - The class ID to delete
     * @returns void
     */
    async remove(id) {
        return db.classes.delete(id);
    },
    /**
     * Delete a class by ID (alias for remove)
     * @param id - The class ID to delete
     * @returns void
     */
    async delete(id) {
        return this.remove(id);
    },
    /**
     * Set or update the template for a class
     * @param classId - The class ID
     * @param template - The template to set, or undefined to clear
     * @returns void
     */
    async setTemplate(classId, template) {
        if (!template) {
            await db.classes.update(classId, { templateId: undefined });
            return;
        }
        await db.classes.update(classId, { templateId: template.id });
    },
    /**
     * Add a student to a class
     * @param classId - The class ID
     * @param studentId - The student ID to add
     * @returns void
     */
    async addStudent(classId, studentId) {
        const classEntity = await this.get(classId);
        if (!classEntity) {
            throw new Error(`Class with ID ${classId} not found`);
        }
        if (!classEntity.studentIds.includes(studentId)) {
            await db.classes.update(classId, {
                studentIds: [...classEntity.studentIds, studentId]
            });
        }
    },
    /**
     * Remove a student from a class
     * @param classId - The class ID
     * @param studentId - The student ID to remove
     * @returns void
     */
    async removeStudent(classId, studentId) {
        const classEntity = await this.get(classId);
        if (!classEntity) {
            throw new Error(`Class with ID ${classId} not found`);
        }
        await db.classes.update(classId, {
            studentIds: classEntity.studentIds.filter(id => id !== studentId)
        });
    },
    /**
     * Check if a class exists
     * @param id - The class ID to check
     * @returns true if the class exists, false otherwise
     */
    async exists(id) {
        const classEntity = await this.get(id);
        return classEntity !== undefined;
    },
    /**
     * Get the count of all classes
     * @returns The total number of classes
     */
    async count() {
        return db.classes.count();
    }
};
