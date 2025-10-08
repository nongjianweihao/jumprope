import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import type { Student } from '../../types/models';
import { nanoid } from '../../utils/id';

export default function StudentsIndex() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    studentsRepo.list().then(setStudents);
  }, []);

  const handleSeed = async () => {
    const student: Student = {
      id: nanoid(),
      name: `学员${students.length + 1}`,
      currentRank: 2,
      pointsTotal: 36,
      badges: ['bronze_attendance']
    };
    await studentsRepo.upsert(student);
    setStudents(await studentsRepo.list());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">学员库</h2>
          <p className="text-sm text-slate-500">管理档案、课时钱包、测评与报告导出</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSeed}
            className="rounded-full border border-brand-primary px-4 py-2 text-sm text-brand-primary"
          >
            快速添加学员
          </button>
          <Link
            to="/students/new"
            className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          >
            新建学员
          </Link>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {students.map((student) => (
          <Link
            key={student.id}
            to={`/students/${student.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-lg font-semibold">{student.name}</div>
            <div className="text-xs text-slate-500">段位：{student.currentRank ?? 0}</div>
            <div className="mt-2 text-sm text-slate-600">积分：{student.pointsTotal ?? 0}</div>
          </Link>
        ))}
        {!students.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500">
            暂无学员数据，点击「新建学员」创建档案。
          </div>
        )}
      </div>
    </div>
  );
}
