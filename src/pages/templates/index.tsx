import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import { drillsRepo } from '../../store/repositories/drillsRepo';
import { gamesRepo } from '../../store/repositories/gamesRepo';
import type { TrainingTemplate } from '../../types/models';

export default function TemplatesIndex() {
  const [templates, setTemplates] = useState<TrainingTemplate[]>([]);
  const [drillMap, setDrillMap] = useState<Record<string, string>>({});
  const [gameMap, setGameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    templatesRepo.list().then(setTemplates);
    drillsRepo.list().then((rows) => {
      const map: Record<string, string> = {};
      rows.forEach((row) => {
        map[row.id] = row.name;
      });
      setDrillMap(map);
    });
    gamesRepo.list().then((rows) => {
      const map: Record<string, string> = {};
      rows.forEach((row) => {
        map[row.id] = row.name;
      });
      setGameMap(map);
    });
  }, []);

  const avgDuration = useMemo(() => {
    if (!templates.length) return 0;
    return (
      templates.reduce((sum, template) => sum + (template.durationMinTotal ?? 0), 0) /
      templates.length
    );
  }, [templates]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">课程模板库</h2>
          <p className="text-sm text-slate-500">平均总时长：{avgDuration.toFixed(1)} 分钟</p>
        </div>
        <Link to="/templates/new" className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          新建模板
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {templates.map((template) => (
          <article
            key={template.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-xs text-slate-500">阶段：{template.period}</p>
              </div>
              <div className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                {template.durationMinTotal ?? 0} min
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {template.blocks.map((block) => (
                <li key={block.id} className="space-y-1 rounded-xl bg-slate-50 px-3 py-2">
                  <div className="font-medium">{block.title}</div>
                  <div className="text-xs text-slate-500">
                    {block.durationMin ?? 0} 分钟 · {block.period}
                  </div>
                  {(block.drillIds?.length || block.gameIds?.length) && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                      {block.drillIds?.map((id) => (
                        <span key={id} className="rounded-full bg-white px-2 py-0.5 shadow" title={drillMap[id] ?? id}>
                          🏋️ {drillMap[id] ?? id}
                        </span>
                      ))}
                      {block.gameIds?.map((id) => (
                        <span key={id} className="rounded-full bg-white px-2 py-0.5 shadow" title={gameMap[id] ?? id}>
                          🎮 {gameMap[id] ?? id}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {!templates.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-slate-500">
            暂无模板，可点击右上角创建或导入 JSON。
          </div>
        )}
      </div>
    </div>
  );
}
