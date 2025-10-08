import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { generateReportDraft } from '../../utils/report';
export default function ReportPreview() {
    const params = useParams();
    const [draft, setDraft] = useState('');
    useEffect(() => {
        if (!params.studentId)
            return;
        (async () => {
            const student = await studentsRepo.get(params.studentId);
            if (student) {
                setDraft(await generateReportDraft(student.name));
            }
        })();
    }, [params.studentId]);
    return (_jsxs("div", { id: "report-root", className: "space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: [_jsx("h2", { className: "text-xl font-bold", children: "\u5BB6\u957F\u62A5\u544A\u9884\u89C8" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u5305\u542B\u8BFE\u65F6\u3001\u901F\u5EA6\u66F2\u7EBF\u3001\u82B1\u6837\u8FDB\u9636\u3001\u96F7\u8FBE\u8BC4\u4F30\u4E0E\u6559\u7EC3\u5BC4\u8BED\u3002" }), _jsxs("article", { className: "rounded-2xl border border-dashed border-brand-primary/40 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-brand-primary", children: "\u6218\u62A5\u901F\u9012" }), _jsx("p", { className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700", children: draft || '正在生成报告内容...' })] })] }));
}
