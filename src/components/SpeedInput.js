import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { nanoid } from '../utils/id';
const windows = [10, 20, 30, 60];
const modes = ['single', 'double'];
export function SpeedInput({ students, defaultWindow = 30, defaultMode = 'single', onSubmit }) {
    const [window, setWindow] = useState(defaultWindow);
    const [mode, setMode] = useState(defaultMode);
    const [values, setValues] = useState({});
    const handleSave = () => {
        const rows = students
            .filter((s) => values[s.id] != null)
            .map((s) => ({
            id: nanoid(),
            studentId: s.id,
            mode,
            window,
            reps: Number(values[s.id]),
            date: new Date().toISOString()
        }));
        onSubmit(rows);
    };
    return (_jsxs("div", { className: "space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold", children: "\u901F\u5EA6\u5F55\u5165" }), _jsx("p", { className: "text-xs text-slate-500", children: "\u652F\u6301 10/20/30/60 \u79D2\u5355\u53CC\u6447" })] }), _jsxs("div", { className: "flex gap-2 text-xs", children: [_jsx("select", { value: window, onChange: (e) => setWindow(Number(e.target.value)), className: "rounded-full border border-slate-200 px-3 py-1", children: windows.map((w) => (_jsx("option", { value: w, children: `${w}s` }, w))) }), _jsx("select", { value: mode, onChange: (e) => setMode(e.target.value), className: "rounded-full border border-slate-200 px-3 py-1 capitalize", children: modes.map((m) => (_jsx("option", { value: m, children: m === 'single' ? '单摇' : '双摇' }, m))) })] })] }), _jsx("div", { className: "space-y-2", children: students.map((student) => (_jsxs("label", { className: "flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm", children: [_jsx("span", { className: "font-medium", children: student.name }), _jsx("input", { type: "number", min: 0, className: "w-24 rounded-full border border-slate-200 px-3 py-1 text-right", value: values[student.id] ?? '', onChange: (event) => setValues((prev) => ({ ...prev, [student.id]: Number(event.target.value) })) })] }, student.id))) }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "button", onClick: handleSave, className: "rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg", children: "\u4FDD\u5B58\u901F\u5EA6\u6210\u7EE9" }) })] }));
}
