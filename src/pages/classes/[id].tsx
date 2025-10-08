import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classesRepo } from '../../store/repositories/classesRepo';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import type { ClassEntity, TrainingTemplate } from '../../types/models';

export default function ClassDetail() {
  const params = useParams();
  const [entity, setEntity] = useState<ClassEntity | undefined>();
  const [templates, setTemplates] = useState<TrainingTemplate[]>([]);

  useEffect(() => {
    if (!params.id) return;
    classesRepo.get(params.id).then(setEntity);
    templatesRepo.list().then(setTemplates);
  }, [params.id]);

  if (!entity) {
    return <div className="text-sm text-slate-500">正在加载班级信息...</div>;
  }

  const template = templates.find((t) => t.id === entity.templateId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{entity.name}</h2>
          <p className="text-sm text-slate-500">教练：{entity.coachName}</p>
        </div>
        <Link
          to={`/session/${entity.id}`}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg"
        >
          开始本节课
        </Link>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-600">默认课程模板</h3>
        {template ? (
          <div className="mt-2 space-y-2 text-sm">
            <div className="font-medium">{template.name}</div>
            <div className="text-xs text-slate-500">
              {template.durationMinTotal ? `总时长 ${template.durationMinTotal} 分钟` : '未设置总时长'}
            </div>
            <ul className="grid gap-2 md:grid-cols-2">
              {template.blocks.map((block) => (
                <li key={block.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-sm font-semibold">{block.title}</div>
                  <div className="text-xs text-slate-500">{block.durationMin ?? 0} min · {block.period}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-2 text-sm text-slate-500">尚未绑定模板，可在模板库创建后绑定。</div>
        )}
      </section>
    </div>
  );
}
