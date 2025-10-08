import { useEffect, useMemo, useState } from 'react';
import { gamesRepo } from '../../store/repositories/gamesRepo';
import type { FitnessQuality, GameItem, TrainingStage } from '../../types/models';

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

const INTENSITY_MAP: Record<NonNullable<GameItem['intensity']>, string> = {
  low: '低强度',
  mid: '中强度',
  high: '高强度'
};

export default function TrainingGames() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [stage, setStage] = useState<TrainingStage | 'ALL'>('ALL');
  const [qualities, setQualities] = useState<FitnessQuality[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | undefined>();

  useEffect(() => {
    gamesRepo.list().then(setGames);
  }, []);

  const filtered = useMemo(() => {
    return games
      .filter((game) => (stage === 'ALL' ? true : game.stage === stage))
      .filter((game) =>
        qualities.length ? qualities.every((quality) => game.qualities.includes(quality)) : true
      )
      .filter((game) => {
        if (!search.trim()) return true;
        const text = search.trim().toLowerCase();
        const haystack = [game.name, game.rules ?? '', game.scoring ?? '', game.safetyNotes ?? '']
          .join(' ')
          .toLowerCase();
        return haystack.includes(text);
      });
  }, [games, stage, qualities, search]);

  const toggleQuality = (quality: FitnessQuality) => {
    setQualities((prev) =>
      prev.includes(quality) ? prev.filter((item) => item !== quality) : [...prev, quality]
    );
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-bold">课堂游戏库</h2>
        <p className="text-sm text-slate-500">快速找到匹配班级阶段的跳绳游戏，激发课堂氛围。</p>
      </header>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStage('ALL')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              stage === 'ALL'
                ? 'bg-brand-primary text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部阶段
          </button>
          {STAGES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStage(item)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                stage === item
                  ? 'bg-brand-primary text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(QUALITY_LABELS) as FitnessQuality[]).map((quality) => (
            <button
              key={quality}
              type="button"
              onClick={() => toggleQuality(quality)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                qualities.includes(quality)
                  ? 'bg-brand-secondary/90 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {QUALITY_LABELS[quality]}
            </button>
          ))}
        </div>
        <div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="搜索游戏名称、规则或安全提示"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((game) => {
          const expanded = expandedId === game.id;
          return (
            <article
              key={game.id}
              className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{game.name}</h3>
                  <p className="text-xs text-slate-500">
                    阶段：{game.stage} · 素质：{game.qualities.map((quality) => QUALITY_LABELS[quality]).join(' / ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? undefined : game.id)}
                  className="text-xs text-brand-primary hover:underline"
                >
                  {expanded ? '收起' : '详情'}
                </button>
              </div>
              <div className="text-xs text-slate-500">
                人数：{game.minPlayers ?? 2}
                {game.maxPlayers ? `-${game.maxPlayers}` : ''} 人 · 时长：{game.durationMin ?? 10} 分钟 · 强度：
                {game.intensity ? INTENSITY_MAP[game.intensity] : '自定义'}
              </div>
              {expanded && (
                <div className="space-y-2 rounded-2xl bg-purple-50 px-3 py-3 text-sm text-slate-600">
                  {game.rules && (
                    <p>
                      <span className="font-semibold text-slate-700">玩法：</span>
                      {game.rules}
                    </p>
                  )}
                  {game.scoring && (
                    <p>
                      <span className="font-semibold text-slate-700">计分：</span>
                      {game.scoring}
                    </p>
                  )}
                  {game.safetyNotes && (
                    <p>
                      <span className="font-semibold text-slate-700">安全提示：</span>
                      {game.safetyNotes}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
        {!filtered.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            未找到匹配的游戏，尝试调整筛选条件。
          </div>
        )}
      </section>
    </div>
  );
}
