import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { nanoid } from '../../utils/id';
export default function StudentsIndex() {
    const [students, setStudents] = useState([]);
    useEffect(() => {
        studentsRepo.list().then(setStudents);
    }, []);
    const handleSeed = async () => {
        const student = {
            id: nanoid(),
            name: `学员${students.length + 1}`,
            currentRank: 2,
            pointsTotal: 36,
            badges: ['bronze_attendance']
        };
        await studentsRepo.upsert(student);
        setStudents(await studentsRepo.list());
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u5B66\u5458\u5E93" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u7BA1\u7406\u6863\u6848\u3001\u8BFE\u65F6\u94B1\u5305\u3001\u6D4B\u8BC4\u4E0E\u62A5\u544A\u5BFC\u51FA" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: handleSeed, className: "rounded-full border border-brand-primary px-4 py-2 text-sm text-brand-primary", children: "\u5FEB\u901F\u6DFB\u52A0\u5B66\u5458" }), _jsx(Link, { to: "/students/new", className: "rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white", children: "\u65B0\u5EFA\u5B66\u5458" })] })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [students.map((student) => (_jsxs(Link, { to: `/students/${student.id}`, className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg", children: [_jsx("div", { className: "text-lg font-semibold", children: student.name }), _jsxs("div", { className: "text-xs text-slate-500", children: ["\u6BB5\u4F4D\uFF1A", student.currentRank ?? 0] }), _jsxs("div", { className: "mt-2 text-sm text-slate-600", children: ["\u79EF\u5206\uFF1A", student.pointsTotal ?? 0] })] }, student.id))), !students.length && (_jsx("div", { className: "rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500", children: "\u6682\u65E0\u5B66\u5458\u6570\u636E\uFF0C\u70B9\u51FB\u300C\u65B0\u5EFA\u5B66\u5458\u300D\u521B\u5EFA\u6863\u6848\u3002" }))] })] }));
}
