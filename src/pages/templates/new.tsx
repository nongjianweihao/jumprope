import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import type { Period, TemplateBlock, TrainingTemplate } from '../../types/models';

const BLOCK_PRESETS: Array<{ title: string; period: Period; duration: number }> = [
  { title: '热身激活', period: 'PREP', duration: 10 },
  { title: '专项技能', period: 'SPEC', duration: 20 },
  { title: '体能素质', period: 'SPEC', duration: 15 },
  { title: '花样进阶', period: 'SPEC', duration: 15 },
  { title: '游戏挑战', period: 'COMP', duration: 10 },
  { title: '放松反馈', period: 'PREP', duration: 5 }
];

export default function TemplateNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('基础准备课 A');
  const [period, setPeriod] = useState<Period>('PREP');
  const [durationMinTotal, setDurationMinTotal] = useState(75);
  const [blocks, setBlocks] = useState<TemplateBlock[]>(
    BLOCK_PRESETS.map((preset) => ({
      id: nanoid(),
      title: preset.title,
      period: preset.period,
      durationMin: preset.duration,
      notes: `${preset.title} - 默认安排`
    }))
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const template: TrainingTemplate = {
      id: nanoid(),
      name,
      period,
      durationMinTotal,
      blocks,
      createdAt: new Date().toISOString()
    };
    await templatesRepo.upsert(template);
    navigate('/templates');
  };

  const totalMinutes = blocks.reduce((sum, block) => sum + (block.durationMin ?? 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">新建课程模板</h2>
        <div className="text-sm text-slate-500">
          已排课时长 {totalMinutes} / 目标 {durationMinTotal} 分钟
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          模板名称
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
        </label>
        <label className="text-sm font-medium">
          适用阶段
          <select value={period} onChange={(event) => setPeriod(event.target.value as Period)} className="mt-1 w-full rounded-xl border border-slate-200 p-3">
            <option value="PREP">PREP · 基础</option>
            <option value="SPEC">SPEC · 提升</option>
            <option value="COMP">COMP · 竞赛</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          总时长 (60–90)
          <input
            type="number"
            min={60}
            max={90}
            value={durationMinTotal}
            onChange={(event) => setDurationMinTotal(Number(event.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3"
          />
        </label>
      </div>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-600">区块设计</h3>
        {blocks.map((block, idx) => (
          <div key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                {idx + 1}
              </span>
              <input
                value={block.title}
                onChange={(event) =>
                  setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, title: event.target.value } : item)))
                }
                className="flex-1 rounded-xl border border-slate-200 p-2 text-sm"
              />
              <input
                type="number"
                min={5}
                max={40}
                value={block.durationMin ?? 0}
                onChange={(event) =>
                  setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, durationMin: Number(event.target.value) } : item)))
                }
                className="w-24 rounded-xl border border-slate-200 p-2 text-sm"
              />
            </div>
            <textarea
              value={block.notes ?? ''}
              onChange={(event) =>
                setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, notes: event.target.value } : item)))
              }
              className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm"
              placeholder="备注：目标素质、花样建议、积分策略等"
            />
          </div>
        ))}
      </section>
      <button type="submit" className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white shadow-lg">
        保存模板
      </button>
    </form>
  );
}
