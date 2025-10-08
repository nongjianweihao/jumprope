import { useEffect, useState } from 'react';
import { nanoid } from '../../utils/id';
import { classesRepo } from '../../store/repositories/classesRepo';
import type { ClassEntity } from '../../types/models';
import { Link } from 'react-router-dom';

export default function ClassesIndex() {
  const [classes, setClasses] = useState<ClassEntity[]>([]);

  useEffect(() => {
    classesRepo.list().then(setClasses);
  }, []);

  const handleCreate = async () => {
    const entity: ClassEntity = {
      id: nanoid(),
      name: `体验班 ${classes.length + 1}`,
      coachName: '勇士教练',
      studentIds: []
    };
    await classesRepo.upsert(entity);
    setClasses(await classesRepo.list());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">班级管理</h2>
          <p className="text-sm text-slate-500">新建班级 → 绑定学员 → 选择模板 → 开启上课</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          新建班级
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {classes.map((item) => (
          <Link
            key={item.id}
            to={`/classes/${item.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-lg font-semibold">{item.name}</div>
            <div className="text-xs text-slate-500">教练：{item.coachName}</div>
            <div className="mt-2 text-sm text-slate-600">学员数：{item.studentIds.length}</div>
          </Link>
        ))}
        {!classes.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
            暂无班级，点击右上角「新建班级」开始。
          </div>
        )}
      </div>
    </div>
  );
}
