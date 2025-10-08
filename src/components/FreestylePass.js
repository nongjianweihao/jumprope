import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { nanoid } from '../utils/id';
export function FreestylePass({ students, moves, onChange }) {
    const options = useMemo(() => [...moves].sort((a, b) => a.rank - b.rank), [moves]);
    const handleSelect = (studentId, moveId) => {
        const move = options.find((m) => m.id === moveId);
        if (!move)
            return;
        const record = {
            id: nanoid(),
            studentId,
            moveId: move.id,
            passed: true,
            date: new Date().toISOString()
        };
        onChange([record]);
    };
    return (_jsxs("div", { className: "space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "text-base font-semibold", children: "\u82B1\u6837\u6311\u6218" }), _jsx("div", { className: "space-y-2", children: students.map((student) => (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium", children: student.name }), _jsxs("select", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm", onChange: (event) => handleSelect(student.id, event.target.value), children: [_jsx("option", { value: "", children: "\u9009\u62E9\u82B1\u6837\u52A8\u4F5C" }), options.map((move) => (_jsx("option", { value: move.id, children: `L${move.rank} · ${move.name}` }, move.id)))] })] }, student.id))) })] }));
}
