import { useState } from 'react';
import { nanoid } from '../utils/id';
import type { Student, WindowSec, JumpMode, SpeedRecord } from '../types/models';

interface Props {
  students: Student[];
  defaultWindow?: WindowSec;
  defaultMode?: JumpMode;
  onSubmit: (rows: SpeedRecord[]) => void;
}

const windows: WindowSec[] = [10, 20, 30, 60];
const modes: JumpMode[] = ['single', 'double'];

export function SpeedInput({ students, defaultWindow = 30, defaultMode = 'single', onSubmit }: Props) {
  const [window, setWindow] = useState<WindowSec>(defaultWindow);
  const [mode, setMode] = useState<JumpMode>(defaultMode);
  const [values, setValues] = useState<Record<string, number>>({});

  const handleSave = () => {
    const rows: SpeedRecord[] = students
      .filter((s) => values[s.id] != null)
      .map((s) => ({
        id: nanoid(),
        studentId: s.id,
        mode,
        window,
        reps: Number(values[s.id]),
        date: new Date().toISOString()
      }));
    onSubmit(rows);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">速度录入</h3>
          <p className="text-xs text-slate-500">支持 10/20/30/60 秒单双摇</p>
        </div>
        <div className="flex gap-2 text-xs">
          <select
            value={window}
            onChange={(e) => setWindow(Number(e.target.value) as WindowSec)}
            className="rounded-full border border-slate-200 px-3 py-1"
          >
            {windows.map((w) => (
              <option key={w} value={w}>{`${w}s`}</option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as JumpMode)}
            className="rounded-full border border-slate-200 px-3 py-1 capitalize"
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {m === 'single' ? '单摇' : '双摇'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        {students.map((student) => (
          <label key={student.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="font-medium">{student.name}</span>
            <input
              type="number"
              min={0}
              className="w-24 rounded-full border border-slate-200 px-3 py-1 text-right"
              value={values[student.id] ?? ''}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [student.id]: Number(event.target.value) }))
              }
            />
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          保存速度成绩
        </button>
      </div>
    </div>
  );
}
