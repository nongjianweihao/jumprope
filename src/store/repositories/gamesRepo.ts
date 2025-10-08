import { db } from '../db';
import type { GameItem, TrainingStage } from '../../types/models';

export const gamesRepo = {
  async upsert(row: GameItem) {
    await db.games.put(row);
    return row;
  },
  async bulkUpsert(rows: GameItem[]) {
    if (!rows.length) return [];
    await db.games.bulkPut(rows);
    return rows;
  },
  async list() {
    return db.games.toArray();
  },
  async get(id: string) {
    return db.games.get(id);
  },
  async remove(id: string) {
    return db.games.delete(id);
  },
  async filterByStage(stage: TrainingStage) {
    return db.games.where('stage').equals(stage).toArray();
  },
  async searchByText(q: string) {
    const text = q.trim().toLowerCase();
    if (!text) {
      return this.list();
    }
    const all = await db.games.toArray();
    return all.filter((item) => {
      const haystack = [
        item.name,
        item.rules ?? '',
        item.scoring ?? '',
        item.safetyNotes ?? ''
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(text);
    });
  }
};
