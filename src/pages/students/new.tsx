import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { studentsRepo } from '../../store/repositories/studentsRepo';

export default function StudentsNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const id = nanoid();
    await studentsRepo.upsert({ id, name, guardian: { name: '家长', phone } });
    navigate(`/students/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <h2 className="text-xl font-bold">新建学员档案</h2>
      <label className="block text-sm font-medium">
        姓名
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
      </label>
      <label className="block text-sm font-medium">
        家长电话
        <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3" />
      </label>
      <button type="submit" className="rounded-full bg-brand-primary px-6 py-2 text-white">
        创建档案
      </button>
    </form>
  );
}
