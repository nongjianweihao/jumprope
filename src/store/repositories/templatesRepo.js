import { db } from '../db';
export const templatesRepo = {
    async upsert(template) {
        await db.templates.put(template);
        return template;
    },
    async list() {
        return db.templates.toArray();
    },
    async get(id) {
        return db.templates.get(id);
    },
    async remove(id) {
        return db.templates.delete(id);
    }
};
