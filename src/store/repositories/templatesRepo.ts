import { db } from '../db';
import type { TrainingTemplate } from '../../types/models';

export const templatesRepo = {
  async upsert(template: TrainingTemplate) {
    await db.templates.put(template);
    return template;
  },
  async list() {
    return db.templates.toArray();
  },
  async get(id: string) {
    return db.templates.get(id);
  },
  async remove(id: string) {
    return db.templates.delete(id);
  }
};
