import type { Student, TrainingTemplate } from '../types/models';

export function exportStudents(students: Student[]): string {
  const header = ['name', 'gender', 'guardian', 'phone'];
  const rows = students.map((student) => [student.name, student.gender ?? '', student.guardian?.name ?? '', student.guardian?.phone ?? '']);
  return [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

export function parseTemplates(json: string): TrainingTemplate[] {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) {
    throw new Error('模板导入需要数组格式');
  }
  return data as TrainingTemplate[];
}
