import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { drillsRepo } from '../../store/repositories/drillsRepo';
import { gamesRepo } from '../../store/repositories/gamesRepo';
import { plansRepo } from '../../store/repositories/plansRepo';
import type { Drill, GameItem, TrainingPlan, TrainingStage } from '../../types/models';

const STAGE_META: Record<TrainingStage, { label: string; desc: string; link: string }> = {
  BASIC: { label: '新手训练营', desc: '建立节奏感与基本体能，适合零基础学员。', link: '/training/qualities?stage=BASIC' },
  IMPROVE: {
    label: '勇士训练场',
    desc: '提升速度、协调与耐力，巩固花样基础。',
    link: '/training/qualities?stage=IMPROVE'
  },
  ELITE: {
    label: '精英竞技场',
    desc: '强化双摇、组合花样与力量循环，为比赛做准备。',
    link: '/training/qualities?stage=ELITE'
  },
  COMPETE: {
    label: '至尊决战场',
    desc: '模拟竞赛节奏，冲刺段位考核与赛事。',
    link: '/training/qualities?stage=COMPETE'
  }
};

export default function TrainingIndex() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);

  useEffect(() => {
    drillsRepo.list().then(setDrills);
    gamesRepo.list().then(setGames);
    plansRepo.list().then(setPlans);
  }, []);

  const latestDrills = useMemo(() => drills.slice(0, 4), [drills]);
  const latestGames = useMemo(() => games.slice(0, 4), [games]);
  const latestPlans = useMemo(() => plans.slice(0, 3), [plans]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-bold">训练模块总览</h2>
        <p className="text-sm text-slate-500">
          从动作库、游戏库到周期计划，构建 60-90 分钟的完整教学闭环。
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-4">
        {(Object.keys(STAGE_META) as TrainingStage[]).map((stage) => {
          const meta = STAGE_META[stage];
          return (
            <Link
              key={stage}
              to={meta.link}
              className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{stage}</span>
                <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs text-brand-primary">阶段</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{meta.label}</h3>
              <p className="text-sm text-slate-500">{meta.desc}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600">最新训练动作</h3>
            <Link to="/training/qualities" className="text-xs text-brand-primary hover:underline">
              查看全部
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {latestDrills.map((item) => (
              <li key={item.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-slate-500">
                  阶段：{item.stage} · 素质：{item.qualities.join(' / ')}
                </div>
              </li>
            ))}
            {!latestDrills.length && <li className="text-xs text-slate-400">暂无动作，可在设置中导入。</li>}
          </ul>
        </article>

        <article className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600">课堂游戏灵感</h3>
            <Link to="/training/games" className="text-xs text-brand-primary hover:underline">
              查看全部
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {latestGames.map((item) => (
              <li key={item.id} className="rounded-2xl bg-purple-50/60 px-3 py-2">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-slate-500">
                  阶段：{item.stage} · 时长：{item.durationMin ?? 0} 分钟
                </div>
              </li>
            ))}
            {!latestGames.length && <li className="text-xs text-slate-400">暂无游戏，快去补充训练乐趣。</li>}
          </ul>
        </article>

        <article className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600">周期计划精选</h3>
            <Link to="/training/plans" className="text-xs text-brand-primary hover:underline">
              查看全部
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {latestPlans.map((plan) => (
              <li key={plan.id} className="rounded-2xl bg-indigo-50/60 px-3 py-2">
                <div className="font-medium">{plan.name}</div>
                <div className="text-xs text-slate-500">
                  阶段：{plan.stage} · 周期：{plan.weeks} 周
                </div>
              </li>
            ))}
            {!latestPlans.length && <li className="text-xs text-slate-400">暂无训练计划，去创建一套吧。</li>}
          </ul>
        </article>
      </section>
    </div>
  );
}
