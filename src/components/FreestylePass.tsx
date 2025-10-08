import { useMemo } from 'react';
import type { FreestyleChallengeRecord, RankMove, Student } from '../types/models';
import { nanoid } from '../utils/id';

interface Props {
  students: Student[];
  moves: RankMove[];
  onChange: (records: FreestyleChallengeRecord[]) => void;
}

export function FreestylePass({ students, moves, onChange }: Props) {
  const options = useMemo(() => [...moves].sort((a, b) => a.rank - b.rank), [moves]);

  const handleSelect = (studentId: string, moveId: string) => {
    const move = options.find((m) => m.id === moveId);
    if (!move) return;
    const record: FreestyleChallengeRecord = {
      id: nanoid(),
      studentId,
      moveId: move.id,
      passed: true,
      date: new Date().toISOString()
    };
    onChange([record]);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold">花样挑战</h3>
      <div className="space-y-2">
        {students.map((student) => (
          <div key={student.id} className="space-y-1">
            <div className="text-sm font-medium">{student.name}</div>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              onChange={(event) => handleSelect(student.id, event.target.value)}
            >
              <option value="">选择花样动作</option>
              {options.map((move) => (
                <option key={move.id} value={move.id}>
                  {`L${move.rank} · ${move.name}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
