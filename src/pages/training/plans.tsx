import { Fragment, useEffect, useMemo, useState } from 'react';
import { plansRepo } from '../../store/repositories/plansRepo';
import { drillsRepo } from '../../store/repositories/drillsRepo';
import { gamesRepo } from '../../store/repositories/gamesRepo';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import type { Drill, GameItem, TemplateBlock, TrainingPlan, TrainingPlanWeek, TrainingStage } from '../../types/models';
import { nanoid } from '../../utils/id';
import { templateFromPlan } from '../../utils/training';

const STAGE_OPTIONS: Array<{ value: TrainingStage; label: string }> = [
  { value: 'BASIC', label: '新手训练营' },
  { value: 'IMPROVE', label: '勇士训练场' },
  { value: 'ELITE', label: '精英竞技场' },
  { value: 'COMPETE', label: '至尊决战场' }
];

function formatIds(value?: string[] | null) {
  return (value ?? []).join(',');
}

function parseIds(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TrainingPlans() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [stageFilter, setStageFilter] = useState<TrainingStage | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [showCreate, setShowCreate] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanWeeks, setNewPlanWeeks] = useState(4);
  const [newPlanStage, setNewPlanStage] = useState<TrainingStage>('BASIC');
  const [drillMap, setDrillMap] = useState<Record<string, Drill>>({});
  const [gameMap, setGameMap] = useState<Record<string, GameItem>>({});
  const [editing, setEditing] = useState<{ weekIndex: number; blockIndex: number } | null>(null);

  useEffect(() => {
    plansRepo.list().then((rows) => {
      setPlans(rows);
      if (!rows.length) return;
      setSelectedId((prev) => prev ?? rows[0]?.id);
    });
    drillsRepo.list().then((rows) => {
      const map: Record<string, Drill> = {};
      rows.forEach((row) => {
        map[row.id] = row;
      });
      setDrillMap(map);
    });
    gamesRepo.list().then((rows) => {
      const map: Record<string, GameItem> = {};
      rows.forEach((row) => {
        map[row.id] = row;
      });
      setGameMap(map);
    });
  }, []);

  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => (stageFilter === 'ALL' ? true : plan.stage === stageFilter))
      .filter((plan) => {
        if (!search.trim()) return true;
        const text = search.trim().toLowerCase();
        const haystack = [
          plan.name,
          plan.remark ?? '',
          ...plan.schedule.map((week) => `${week.theme} ${week.blocks.map((block) => block.title).join(' ')}`)
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(text);
      });
  }, [plans, stageFilter, search]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedId) ?? filteredPlans[0],
    [plans, filteredPlans, selectedId]
  );

  useEffect(() => {
    if (filteredPlans.length && !filteredPlans.some((plan) => plan.id === selectedId)) {
      setSelectedId(filteredPlans[0].id);
    }
  }, [filteredPlans, selectedId]);

  const updatePlan = async (next: TrainingPlan) => {
    await plansRepo.upsert(next);
    setPlans((prev) => prev.map((plan) => (plan.id === next.id ? next : plan)));
  };

  const handleCreatePlan = async () => {
    if (!newPlanName.trim()) {
      alert('请输入计划名称');
      return;
    }
    const weeks: TrainingPlanWeek[] = Array.from({ length: newPlanWeeks }).map((_, idx) => ({
      weekIndex: idx + 1,
      theme: `第 ${idx + 1} 周主题`,
      blocks: [
        { title: '热身激活', durationMin: 10 },
        { title: '专项技能', durationMin: 20 },
        { title: '体能素质', durationMin: 15 },
        { title: '游戏挑战', durationMin: 10 },
        { title: '放松反馈', durationMin: 5 }
      ]
    }));
    const plan: TrainingPlan = {
      id: nanoid(),
      name: newPlanName.trim(),
      stage: newPlanStage,
      weeks: newPlanWeeks,
      schedule: weeks,
      createdAt: new Date().toISOString()
    };
    await plansRepo.upsert(plan);
    setPlans((prev) => [plan, ...prev]);
    setSelectedId(plan.id);
    setShowCreate(false);
    setNewPlanName('');
  };

  const handleBlockUpdate = async (
    plan: TrainingPlan,
    weekIndex: number,
    blockIndex: number,
    updates: Partial<TemplateBlock>
  ) => {
    const schedule = plan.schedule.map((week) => ({ ...week, blocks: week.blocks.map((block) => ({ ...block })) }));
    const targetWeek = schedule.find((week) => week.weekIndex === weekIndex);
    if (!targetWeek) return;
    const targetBlock = targetWeek.blocks[blockIndex];
    if (!targetBlock) return;
    targetBlock.title = updates.title ?? targetBlock.title;
    targetBlock.durationMin = updates.durationMin ?? targetBlock.durationMin;
    targetBlock.notes = updates.notes ?? targetBlock.notes;
    targetBlock.drillIds = updates.drillIds ?? targetBlock.drillIds;
    targetBlock.gameIds = updates.gameIds ?? targetBlock.gameIds;
    const nextPlan: TrainingPlan = { ...plan, schedule };
    await updatePlan(nextPlan);
  };

  const handleAddBlock = async (plan: TrainingPlan, weekIndex: number) => {
    const schedule = plan.schedule.map((week) => ({ ...week, blocks: week.blocks.map((block) => ({ ...block })) }));
    const targetWeek = schedule.find((week) => week.weekIndex === weekIndex);
    if (!targetWeek) return;
    targetWeek.blocks.push({ title: '新增训练块', durationMin: 10, notes: '补充内容' });
    const nextPlan: TrainingPlan = { ...plan, schedule };
    await updatePlan(nextPlan);
  };

  const handleRemoveBlock = async (plan: TrainingPlan, weekIndex: number, blockIndex: number) => {
    const schedule = plan.schedule.map((week) => ({ ...week, blocks: week.blocks.map((block) => ({ ...block })) }));
    const targetWeek = schedule.find((week) => week.weekIndex === weekIndex);
    if (!targetWeek) return;
    targetWeek.blocks.splice(blockIndex, 1);
    const nextPlan: TrainingPlan = { ...plan, schedule };
    await updatePlan(nextPlan);
  };

  const handleGenerateTemplate = async (plan: TrainingPlan) => {
    const template = templateFromPlan(plan);
    await templatesRepo.upsert(template);
    alert(`已生成模板「${template.name}」，可前往模板库查看。`);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-bold">周期训练计划</h2>
        <p className="text-sm text-slate-500">按阶段管理训练周期，可一键生成课堂模板。</p>
      </header>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <aside className="w-full space-y-4 lg:w-64">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStageFilter('ALL')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                stageFilter === 'ALL'
                  ? 'bg-brand-primary text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部阶段
            </button>
            {STAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStageFilter(option.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  stageFilter === option.value
                    ? 'bg-brand-primary text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.value}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="搜索计划名称或主题"
          />
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="w-full rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          >
            新建计划
          </button>
          <div className="space-y-2 text-sm">
            {filteredPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedId(plan.id);
                  setEditing(null);
                }}
                className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                  selectedPlan?.id === plan.id
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">{plan.name}</div>
                <div className="text-xs text-slate-500">
                  阶段：{plan.stage} · {plan.weeks} 周
                </div>
              </button>
            ))}
            {!filteredPlans.length && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-xs text-slate-500">
                暂无符合条件的计划。
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          {selectedPlan ? (
            <Fragment>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                  <p className="text-xs text-slate-500">
                    阶段：{selectedPlan.stage} · 周期：{selectedPlan.weeks} 周
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerateTemplate(selectedPlan)}
                  className="rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-white"
                >
                  从本计划生成模板
                </button>
              </div>

              <div className="space-y-4">
                {selectedPlan.schedule.map((week) => (
                  <section key={week.weekIndex} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700">
                          第 {week.weekIndex} 周 · {week.theme}
                        </h4>
                        <p className="text-xs text-slate-500">
                          总训练块：{week.blocks.length} · 时长：
                          {week.blocks.reduce((sum, block) => sum + (block.durationMin ?? 0), 0)} 分钟
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddBlock(selectedPlan, week.weekIndex)}
                        className="rounded-full border border-brand-primary px-3 py-1 text-xs text-brand-primary"
                      >
                        添加训练块
                      </button>
                    </div>

                    <div className="space-y-2">
                      {week.blocks.map((block, idx) => {
                        const isEditing = editing?.weekIndex === week.weekIndex && editing.blockIndex === idx;
                        return (
                          <div
                            key={`${week.weekIndex}-${idx}`}
                            className={`rounded-2xl border px-3 py-2 ${
                              isEditing ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{block.title}</div>
                                <div className="text-xs text-slate-500">
                                  时长：{block.durationMin ?? 0} 分钟 · Drill {block.drillIds?.length ?? 0} · Game {block.gameIds?.length ?? 0}
                                </div>
                                {(block.drillIds?.length || block.gameIds?.length) && (
                                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                                    {block.drillIds?.map((id) => (
                                      <span key={id} className="rounded-full bg-white px-2 py-0.5 shadow">
                                        🏋️ {drillMap[id]?.name ?? id}
                                      </span>
                                    ))}
                                    {block.gameIds?.map((id) => (
                                      <span key={id} className="rounded-full bg-white px-2 py-0.5 shadow">
                                        🎮 {gameMap[id]?.name ?? id}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditing({ weekIndex: week.weekIndex, blockIndex: idx })}
                                  className="text-xs text-brand-primary hover:underline"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBlock(selectedPlan, week.weekIndex, idx)}
                                  className="text-xs text-rose-500 hover:underline"
                                >
                                  删除
                                </button>
                              </div>
                            </div>

                            {isEditing && (
                              <form
                                className="mt-3 grid gap-2 md:grid-cols-2"
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  const form = event.currentTarget as HTMLFormElement & {
                                    title: HTMLInputElement;
                                    duration: HTMLInputElement;
                                    notes: HTMLTextAreaElement;
                                    drillIds: HTMLInputElement;
                                    gameIds: HTMLInputElement;
                                  };
                                  handleBlockUpdate(selectedPlan, week.weekIndex, idx, {
                                    title: form.title.value,
                                    durationMin: Number(form.duration.value) || undefined,
                                    notes: form.notes.value,
                                    drillIds: parseIds(form.drillIds.value),
                                    gameIds: parseIds(form.gameIds.value)
                                  });
                                  setEditing(null);
                                }}
                              >
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                                  标题
                                  <input
                                    name="title"
                                    defaultValue={block.title}
                                    className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                                  时长(分钟)
                                  <input
                                    name="duration"
                                    type="number"
                                    defaultValue={block.durationMin ?? 0}
                                    className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
                                  />
                                </label>
                                <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-slate-600">
                                  备注
                                  <textarea
                                    name="notes"
                                    defaultValue={block.notes ?? ''}
                                    className="h-16 rounded-xl border border-slate-200 px-2 py-1 text-sm"
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                                  Drill IDs
                                  <input
                                    name="drillIds"
                                    defaultValue={formatIds(block.drillIds)}
                                    className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
                                    placeholder="逗号分隔，如 d-basic-001"
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                                  Game IDs
                                  <input
                                    name="gameIds"
                                    defaultValue={formatIds(block.gameIds)}
                                    className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
                                    placeholder="逗号分隔，如 g-basic-001"
                                  />
                                </label>
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="rounded-full px-4 py-2 text-xs text-slate-500 hover:bg-slate-100"
                                  >
                                    取消
                                  </button>
                                  <button
                                    type="submit"
                                    className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
                                  >
                                    保存
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </Fragment>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              选择左侧计划以查看详情，或新建一个计划。
            </div>
          )}
        </main>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">新建训练计划</h3>
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
              计划名称
              <input
                value={newPlanName}
                onChange={(event) => setNewPlanName(event.target.value)}
                className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
                placeholder="例如：勇士训练营·4周强化"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
              阶段
              <select
                value={newPlanStage}
                onChange={(event) => setNewPlanStage(event.target.value as TrainingStage)}
                className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
              >
                {STAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
              周数
              <input
                type="number"
                min={1}
                max={12}
                value={newPlanWeeks}
                onChange={(event) => setNewPlanWeeks(Number(event.target.value) || 1)}
                className="rounded-xl border border-slate-200 px-2 py-1 text-sm"
              />
            </label>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-full px-4 py-2 text-xs text-slate-500 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreatePlan}
                className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
