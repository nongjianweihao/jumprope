import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { testsRepo } from '../../store/repositories/testsRepo';
import { plansRepo } from '../../store/repositories/plansRepo';
import { drillsRepo } from '../../store/repositories/drillsRepo';
import { gamesRepo } from '../../store/repositories/gamesRepo';
import type { Drill, FitnessQuality, GameItem, TrainingPlan } from '../../types/models';
import { generateReportDraft } from '../../utils/report';
import { findWeakestQuality, suggestPlansByQuality } from '../../utils/recommend';

export default function ReportPreview() {
  const params = useParams();
  const [draft, setDraft] = useState('');
  const [latestRadar, setLatestRadar] = useState<Record<FitnessQuality, number> | undefined>();
  const [planSuggestions, setPlanSuggestions] = useState<TrainingPlan[]>([]);
  const [drillSuggestions, setDrillSuggestions] = useState<Drill[]>([]);
  const [gameSuggestions, setGameSuggestions] = useState<GameItem[]>([]);

  useEffect(() => {
    if (!params.studentId) return;
    (async () => {
      const [student, tests, plans, drills, games] = await Promise.all([
        studentsRepo.get(params.studentId!),
        testsRepo.listByStudent(params.studentId!),
        plansRepo.list(),
        drillsRepo.list(),
        gamesRepo.list()
      ]);

      if (student) {
        setDraft(await generateReportDraft(student.name));
      }

      const latest = tests.length ? tests[tests.length - 1] : undefined;
      setLatestRadar(latest?.radar);

      if (latest?.radar) {
        const weak = findWeakestQuality(latest.radar);
        if (weak) {
          const plansByQuality = suggestPlansByQuality(plans, drills, games, weak);
          setPlanSuggestions(plansByQuality);
          setDrillSuggestions(
            drills
              .filter((drill) => drill.qualities.includes(weak))
              .slice(0, 3)
          );
          setGameSuggestions(
            games
              .filter((game) => game.qualities.includes(weak))
              .slice(0, 3)
          );
        } else {
          setPlanSuggestions([]);
          setDrillSuggestions([]);
          setGameSuggestions([]);
        }
      } else {
        setPlanSuggestions([]);
        setDrillSuggestions([]);
        setGameSuggestions([]);
      }
    })();
  }, [params.studentId]);

  const weakestLabel = useMemo(() => {
    if (!latestRadar) return undefined;
    const quality = findWeakestQuality(latestRadar);
    if (!quality) return undefined;
    const map: Record<FitnessQuality, string> = {
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
    return map[quality];
  }, [latestRadar]);

  return (
    <div id="report-root" className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">家长报告预览</h2>
      <p className="text-sm text-slate-500">包含课时、速度曲线、花样进阶、雷达评估与教练寄语。</p>
      <article className="rounded-2xl border border-dashed border-brand-primary/40 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-brand-primary">战报速递</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{draft || '正在生成报告内容...'}</p>
      </article>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-600">训练周期进展</h3>
          {weakestLabel && <span className="text-xs text-brand-secondary">当前弱项：{weakestLabel}</span>}
        </div>
        {latestRadar ? (
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              最新体能雷达已更新，系统捕捉到 <span className="font-semibold">{weakestLabel}</span> 维度仍有提升空间，建议在接下来的 4 周中持续跟进对应训练块。
            </p>
            {planSuggestions.length ? (
              <ul className="space-y-2 text-sm">
                {planSuggestions.map((plan) => (
                  <li key={plan.id} className="rounded-xl bg-indigo-50/60 px-3 py-2">
                    <div className="font-medium text-slate-700">{plan.name}</div>
                    <div className="text-xs text-slate-500">
                      阶段：{plan.stage} · 周期：{plan.weeks} 周
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">暂无直接匹配的周期计划，可在训练模块中补充。</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">待录入季度体能测评后，将自动生成进展分析。</p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-600">下周期建议</h3>
        {latestRadar ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500">优先训练动作</h4>
              {drillSuggestions.length ? (
                <ul className="space-y-2 text-sm">
                  {drillSuggestions.map((drill) => (
                    <li key={drill.id} className="rounded-xl bg-slate-50 px-3 py-2">
                      <div className="font-medium">{drill.name}</div>
                      <div className="text-xs text-slate-500">
                        素质：{drill.qualities.join(' / ')} · 建议 {drill.durationMin ?? 8} 分钟
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">暂无匹配训练动作，可在训练库中扩充。</p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500">课堂游戏点子</h4>
              {gameSuggestions.length ? (
                <ul className="space-y-2 text-sm">
                  {gameSuggestions.map((game) => (
                    <li key={game.id} className="rounded-xl bg-purple-50 px-3 py-2">
                      <div className="font-medium">{game.name}</div>
                      <div className="text-xs text-slate-500">
                        人数：{game.minPlayers ?? 2}-{game.maxPlayers ?? 12} · 时长：{game.durationMin ?? 10} 分钟
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">暂无匹配游戏，尝试更换训练主题。</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">待有训练数据后将推荐对应动作与游戏。</p>
        )}
      </section>
    </div>
  );
}
