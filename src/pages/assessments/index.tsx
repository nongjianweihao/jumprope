import { useState } from 'react';
import { testsRepo } from '../../store/repositories/testsRepo';
import { nanoid } from '../../utils/id';
import type { FitnessQuality, FitnessTestResult } from '../../types/models';

const QUALITIES: FitnessQuality[] = ['speed', 'power', 'endurance', 'coordination', 'agility', 'balance', 'flexibility', 'core', 'accuracy'];

export default function AssessmentsIndex() {
  const [quarter, setQuarter] = useState('2025Q4');
  const [studentId, setStudentId] = useState('demo');

  const handleCreate = async () => {
    const result: FitnessTestResult = {
      id: nanoid(),
      studentId,
      quarter,
      date: new Date().toISOString(),
      items: QUALITIES.map((quality, idx) => ({ itemId: `${quality}-${idx}`, value: 60 + idx * 2 })),
      radar: QUALITIES.reduce((acc, quality, idx) => ({ ...acc, [quality]: 60 + idx * 4 }), {} as Record<FitnessQuality, number>)
    };
    await testsRepo.upsert(result);
    alert('季度测评已生成并同步到档案');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">季度测评 & 段位考核</h2>
        <p className="text-sm text-slate-500">录入体能数据后自动生成雷达图，满足速度阈值自动段位升级。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium">
          测评季度
          <input value={quarter} onChange={(event) => setQuarter(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
        </label>
        <label className="text-sm font-medium">
          学员 ID
          <input value={studentId} onChange={(event) => setStudentId(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
        </label>
      </div>
      <button type="button" onClick={handleCreate} className="rounded-full bg-brand-primary px-6 py-2 text-sm font-semibold text-white">
        生成季度测评
      </button>
    </div>
  );
}
