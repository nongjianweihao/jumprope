import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { drillsRepo } from '../../store/repositories/drillsRepo';
import type { Drill, FitnessQuality, TrainingStage } from '../../types/models';

const STAGES: TrainingStage[] = ['BASIC', 'IMPROVE', 'ELITE', 'COMPETE'];
const QUALITY_LABELS: Record<FitnessQuality, string> = {
  speed: '速度',
  power: '力量',
  endurance: '耐力',
  coordination: '协调',
  agility: '灵敏',
  balance: '平衡',
  flexibility: '柔韧',
  core: '核心',
  accuracy: '准确'
};

function StageChip({
  value,
  active,
  onClick
}: {
  value: TrainingStage | 'ALL';
  active: boolean;
  onClick: (stage: TrainingStage | 'ALL') => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active ? 'bg-brand-primary text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
      }`}
    >
      {value === 'ALL' ? '全部阶段' : value}
    </button>
  );
}

function QualityChip({
  value,
  active,
  onClick
}: {
  value: FitnessQuality;
  active: boolean;
  onClick: (quality: FitnessQuality) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? 'bg-brand-secondary/90 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
      }`}
    >
      {QUALITY_LABELS[value]}
    </button>
  );
}

export default function TrainingQualities() {
  const [params, setParams] = useSearchParams();
  const [stage, setStage] = useState<TrainingStage | 'ALL'>(() => {
    const initial = params.get('stage');
    return STAGES.includes(initial as TrainingStage) ? (initial as TrainingStage) : 'ALL';
  });
  const [selectedQualities, setSelectedQualities] = useState<FitnessQuality[]>([]);
  const [search, setSearch] = useState('');
  const [drills, setDrills] = useState<Drill[]>([]);
  const [expandedId, setExpandedId] = useState<string | undefined>();

  useEffect(() => {
    drillsRepo.list().then(setDrills);
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (stage === 'ALL') {
      next.delete('stage');
    } else {
      next.set('stage', stage);
    }
    setParams(next, { replace: true });
  }, [stage, params, setParams]);

  const filtered = useMemo(() => {
    return drills
      .filter((drill) => (stage === 'ALL' ? true : drill.stage === stage))
      .filter((drill) =>
        selectedQualities.length
          ? selectedQualities.every((quality) => drill.qualities.includes(quality))
          : true
      )
      .filter((drill) => {
        if (!search.trim()) return true;
        const text = search.trim().toLowerCase();
        const haystack = [
          drill.name,
          drill.description ?? '',
          ...(drill.cues ?? []),
          ...(drill.progressions ?? [])
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(text);
      });
  }, [drills, stage, selectedQualities, search]);

  const toggleQuality = (quality: FitnessQuality) => {
    setSelectedQualities((prev) =>
      prev.includes(quality) ? prev.filter((item) => item !== quality) : [...prev, quality]
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-bold">训练动作库</h2>
        <p className="text-sm text-slate-500">根据阶段、体能素质与关键词筛选合适的训练动作。</p>
      </header>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StageChip value="ALL" active={stage === 'ALL'} onClick={setStage} />
          {STAGES.map((item) => (
            <StageChip key={item} value={item} active={stage === item} onClick={setStage} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(QUALITY_LABELS) as FitnessQuality[]).map((quality) => (
            <QualityChip
              key={quality}
              value={quality}
              active={selectedQualities.includes(quality)}
              onClick={toggleQuality}
            />
          ))}
        </div>
        <div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="搜索动作名称、要点或提示词"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((drill) => {
          const expanded = expandedId === drill.id;
          return (
            <article
              key={drill.id}
              className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{drill.name}</h3>
                  <p className="text-xs text-slate-500">
                    阶段：{drill.stage} · 素质：{drill.qualities.map((quality) => QUALITY_LABELS[quality]).join(' / ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? undefined : drill.id)}
                  className="text-xs text-brand-primary hover:underline"
                >
                  {expanded ? '收起' : '详情'}
                </button>
              </div>
              <div className="text-xs text-slate-500">建议时长：{drill.durationMin ?? 8} 分钟 · 难度：{'★'.repeat(drill.difficulty ?? 1)}</div>
              {expanded && (
                <div className="space-y-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  {drill.description && <p>{drill.description}</p>}
                  {drill.cues?.length ? (
                    <p>
                      <span className="font-semibold text-slate-700">口令：</span>
                      {drill.cues.join(' / ')}
                    </p>
                  ) : null}
                  {drill.progressions?.length ? (
                    <p>
                      <span className="font-semibold text-slate-700">进阶：</span>
                      {drill.progressions.join('、')}
                    </p>
                  ) : null}
                  {drill.equipment?.length ? (
                    <p>
                      <span className="font-semibold text-slate-700">器材：</span>
                      {drill.equipment.join('、')}
                    </p>
                  ) : null}
                </div>
              )}
            </article>
          );
        })}
        {!filtered.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            未找到匹配的训练动作，尝试调整筛选条件。
          </div>
        )}
      </section>
    </div>
  );
}
