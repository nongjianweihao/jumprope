import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { classesRepo } from '../../store/repositories/classesRepo';

export default function ClassNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('春季基础班');
  const [coachName, setCoachName] = useState('勇士教练');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const id = nanoid();
    await classesRepo.upsert({ id, name, coachName, studentIds: [] });
    navigate(`/classes/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <h2 className="text-xl font-bold">新建班级</h2>
      <label className="block text-sm font-medium">
        班级名称
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 p-3"
        />
      </label>
      <label className="block text-sm font-medium">
        教练姓名
        <input
          value={coachName}
          onChange={(event) => setCoachName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 p-3"
        />
      </label>
      <button type="submit" className="rounded-full bg-brand-primary px-6 py-2 text-white">
        创建
      </button>
    </form>
  );
}
