import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const labels = {
    totalStudents: '在读学员',
    totalRevenue: '总收入 (元)',
    consumed: '已消课时',
    remaining: '剩余课时',
    arpu: '人均收入 (元)',
    consumeRate: '课消率 (%)'
};
export function FinanceCards({ kpis }) {
    return (_jsx("div", { className: "grid gap-4 md:grid-cols-3", children: Object.keys(labels).map((key) => (_jsx("div", { className: "rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1px] shadow-[0_0_40px_rgba(74,108,247,0.25)]", children: _jsxs("div", { className: "h-full rounded-3xl bg-slate-950/90 p-5 text-white", children: [_jsx("div", { className: "text-xs uppercase tracking-widest text-white/70", children: labels[key] }), _jsx("div", { className: "mt-3 text-3xl font-black tabular-nums", children: key === 'consumeRate' ? `${(kpis[key] ?? 0).toFixed(1)}%` : Math.round(kpis[key] ?? 0) })] }) }, key))) }));
}
