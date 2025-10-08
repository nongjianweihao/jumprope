import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export function ProgressChart({ series, title, unit }) {
    return (_jsxs("div", { className: "space-y-2", children: [title ? _jsx("h3", { className: "text-sm font-semibold text-slate-600", children: title }) : null, _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(AreaChart, { data: series, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2E8F0" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 } }), _jsx(YAxis, { tick: { fontSize: 10 }, width: 32, unit: unit }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "score", stroke: "#4A6CF7", fill: "#4A6CF7", fillOpacity: 0.2 })] }) })] }));
}
