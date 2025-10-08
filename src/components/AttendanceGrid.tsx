import type { AttendanceItem, Student } from '../types/models';

interface Props {
  students: Student[];
  value: AttendanceItem[];
  onChange: (value: AttendanceItem[]) => void;
}

export function AttendanceGrid({ students, value, onChange }: Props) {
  const toggle = (studentId: string) => {
    const next = value.some((v) => v.studentId === studentId)
      ? value.filter((v) => v.studentId !== studentId)
      : [...value, { studentId, present: true }];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-600">出勤表</h3>
      <div className="grid grid-cols-2 gap-2">
        {students.map((s) => {
          const item = value.find((v) => v.studentId === s.id);
          const present = item?.present ?? false;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition ${present ? 'border-brand-primary bg-white text-brand-primary' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-brand-primary/40'}`}
            >
              <div className="font-medium">{s.name}</div>
              <div className="text-xs">{present ? '已出勤' : '未出勤'}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
