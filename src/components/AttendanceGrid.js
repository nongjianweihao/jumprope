import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AttendanceGrid({ students, value, onChange }) {
    const toggle = (studentId) => {
        const next = value.some((v) => v.studentId === studentId)
            ? value.filter((v) => v.studentId !== studentId)
            : [...value, { studentId, present: true }];
        onChange(next);
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u51FA\u52E4\u8868" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: students.map((s) => {
                    const item = value.find((v) => v.studentId === s.id);
                    const present = item?.present ?? false;
                    return (_jsxs("button", { onClick: () => toggle(s.id), className: `rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition ${present ? 'border-brand-primary bg-white text-brand-primary' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-brand-primary/40'}`, children: [_jsx("div", { className: "font-medium", children: s.name }), _jsx("div", { className: "text-xs", children: present ? '已出勤' : '未出勤' })] }, s.id));
                }) })] }));
}
