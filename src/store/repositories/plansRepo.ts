import { db } from '../db';
import type { TrainingPlan, TrainingStage } from '../../types/models';

export const plansRepo = {
  async upsert(row: TrainingPlan) {
    await db.plans.put(row);
    return row;
  },
  async bulkUpsert(rows: TrainingPlan[]) {
    if (!rows.length) return [];
    await db.plans.bulkPut(rows);
    return rows;
  },
  async list() {
    return db.plans.toArray();
  },
  async get(id: string) {
    return db.plans.get(id);
  },
  async remove(id: string) {
    return db.plans.delete(id);
  },
  async filterByStage(stage: TrainingStage) {
    return db.plans.where('stage').equals(stage).toArray();
  },
  async searchByText(q: string) {
    const text = q.trim().toLowerCase();
    if (!text) {
      return this.list();
    }
    const all = await db.plans.toArray();
    return all.filter((item) => {
      const haystack = [
        item.name,
        item.remark ?? '',
        ...item.schedule.map((week) => week.theme)
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(text);
    });
  }
};
