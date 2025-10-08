import { db } from '../db';
export const classesRepo = {
    async upsert(entity) {
        await db.classes.put(entity);
        return entity;
    },
    async list() {
        return db.classes.toArray();
    },
    async get(id) {
        return db.classes.get(id);
    },
    async remove(id) {
        return db.classes.delete(id);
    },
    async setTemplate(classId, template) {
        if (!template) {
            await db.classes.update(classId, { templateId: undefined });
            return;
        }
        await db.classes.update(classId, { templateId: template.id });
    }
};
