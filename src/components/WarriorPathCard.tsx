import type { WarriorPathNode, Student } from '../types/models';
import { RankBadge } from './RankBadge';

interface Props {
  student: Student;
  path: WarriorPathNode[];
}

export function WarriorPathCard({ student, path }: Props) {
  const stages = path ?? [];

  if (!stages.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
        暂未配置勇士成长路径，请前往设置页添加。
      </div>
    );
  }

  const currentRank = student.currentRank ?? 1;
  const progressIndex = stages.findIndex((stage) => stage.rank > currentRank);
  const activeIndex = progressIndex === -1 ? stages.length - 1 : Math.max(0, progressIndex);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-600">勇士成长路径</h3>
      <div className="mt-3 flex flex-col gap-3">
        {stages.map((stage, index) => {
          const achieved = stage.rank <= currentRank;
          const active = index === activeIndex && !achieved;
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
                achieved
                  ? 'border border-green-300 bg-green-50 text-green-700'
                  : active
                  ? 'border border-brand-primary bg-brand-primary/10 text-brand-primary'
                  : 'border border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <RankBadge rank={stage.rank} />
              <div>
                <div className="text-sm font-medium">{stage.title}</div>
                <div className="text-xs">{achieved ? '已解锁' : active ? '冲刺中…' : '待挑战'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
