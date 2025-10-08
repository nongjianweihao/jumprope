import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function RankBadge({ rank }) {
    const colors = ['bg-zinc-400', 'bg-blue-500', 'bg-purple-600', 'bg-amber-500', 'bg-rose-500'];
    const c = colors[Math.min(colors.length - 1, Math.max(0, Math.floor((rank - 1) / 2)))];
    return (_jsxs("div", { className: `inline-flex items-center gap-1 rounded-full px-2 py-1 text-white ${c}`, children: [_jsx("span", { className: "text-xs tracking-wide", children: "\u6BB5\u4F4D" }), _jsx("b", { className: "text-sm font-semibold", children: rank })] }));
}
