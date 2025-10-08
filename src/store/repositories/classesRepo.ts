import { db } from '../db';
import type { ClassEntity, TrainingTemplate } from '../../types/models';

export const classesRepo = {
  async upsert(entity: ClassEntity) {
    await db.classes.put(entity);
    return entity;
  },
  async list() {
    return db.classes.toArray();
  },
  async get(id: string) {
    return db.classes.get(id);
  },
  async remove(id: string) {
    return db.classes.delete(id);
  },
  async setTemplate(classId: string, template: TrainingTemplate | undefined) {
    if (!template) {
      await db.classes.update(classId, { templateId: undefined });
      return;
    }
    await db.classes.update(classId, { templateId: template.id });
  }
};
