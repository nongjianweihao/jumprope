import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { generateReportDraft } from '../../utils/report';

export default function ReportPreview() {
  const params = useParams();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!params.studentId) return;
    (async () => {
      const student = await studentsRepo.get(params.studentId!);
      if (student) {
        setDraft(await generateReportDraft(student.name));
      }
    })();
  }, [params.studentId]);

  return (
    <div id="report-root" className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">家长报告预览</h2>
      <p className="text-sm text-slate-500">包含课时、速度曲线、花样进阶、雷达评估与教练寄语。</p>
      <article className="rounded-2xl border border-dashed border-brand-primary/40 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-brand-primary">战报速递</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{draft || '正在生成报告内容...'}</p>
      </article>
    </div>
  );
}
