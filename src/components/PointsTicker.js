import { jsx as _jsx } from "react/jsx-runtime";
export function PointsTicker({ delta }) {
    const prefix = delta >= 0 ? '+' : '';
    return _jsx("span", { className: "text-lg font-black text-brand-secondary animate-bounce", children: `${prefix}${delta}` });
}
