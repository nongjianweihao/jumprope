import { db } from '../db';
import type { Drill, TrainingStage } from '../../types/models';

export const drillsRepo = {
  async upsert(row: Drill) {
    await db.drills.put(row);
    return row;
  },
  async bulkUpsert(rows: Drill[]) {
    if (!rows.length) return [];
    await db.drills.bulkPut(rows);
    return rows;
  },
  async list() {
    return db.drills.toArray();
  },
  async get(id: string) {
    return db.drills.get(id);
  },
  async remove(id: string) {
    return db.drills.delete(id);
  },
  async filterByStage(stage: TrainingStage) {
    return db.drills.where('stage').equals(stage).toArray();
  },
  async searchByText(q: string) {
    const text = q.trim().toLowerCase();
    if (!text) {
      return this.list();
    }
    const all = await db.drills.toArray();
    return all.filter((item) => {
      const haystack = [
        item.name,
        item.description ?? '',
        ...(item.cues ?? []),
        ...(item.progressions ?? [])
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(text);
    });
  }
};
