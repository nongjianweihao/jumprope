import { db } from './db';
import seed from '../seeds/seed.json';
import lib from '../seeds/public_library.json';
import training from '../seeds/training.json';

export async function ensureSeed() {
  if (typeof window === 'undefined') return;

  const baseFlag = window.localStorage.getItem('seed:v1');
  if (!baseFlag) {
    await db.transaction('rw', db.students, db.classes, db.templates, async () => {
      await db.students.bulkPut((seed as any).students);
      await db.classes.bulkPut((seed as any).classes);
      await db.templates.bulkPut((seed as any).templates);
    });

    window.localStorage.setItem('public_library', JSON.stringify(lib));
    window.localStorage.setItem('seed:v1', '1');
  }

  const trainingFlag = window.localStorage.getItem('seed_training:v1');
  if (!trainingFlag) {
    await db.transaction('rw', db.drills, db.games, db.plans, async () => {
      const data = training as any;
      if (Array.isArray(data?.drills)) {
        await db.drills.bulkPut(data.drills);
      }
      if (Array.isArray(data?.games)) {
        await db.games.bulkPut(data.games);
      }
      if (Array.isArray(data?.plans)) {
        await db.plans.bulkPut(data.plans);
      }
    });
    window.localStorage.setItem('seed_training:v1', '1');
  }
}
