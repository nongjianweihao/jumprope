import { db } from './db';
import seed from '../seeds/seed.json';
import lib from '../seeds/public_library.json';

export async function ensureSeed() {
  if (typeof window === 'undefined') return;
  const flag = window.localStorage.getItem('seed:v1');
  if (flag) return;

  await db.transaction('rw', db.students, db.classes, db.templates, async () => {
    await db.students.bulkPut((seed as any).students);
    await db.classes.bulkPut((seed as any).classes);
    await db.templates.bulkPut((seed as any).templates);
  });

  window.localStorage.setItem('public_library', JSON.stringify(lib));
  window.localStorage.setItem('seed:v1', '1');
}
