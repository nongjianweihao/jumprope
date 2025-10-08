import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HighlightsCard({ highlights }) {
    if (!highlights.length) {
        return (_jsx("div", { className: "rounded-2xl border border-dashed border-brand-primary/40 bg-white p-4 text-sm text-slate-500", children: "\u672C\u8282\u8BFE\u5C1A\u672A\u751F\u6210\u9AD8\u5149\uFF0C\u5B8C\u6210\u901F\u5EA6/\u82B1\u6837\u5F55\u5165\u540E\u81EA\u52A8\u751F\u6210\u3002" }));
    }
    return (_jsxs("div", { className: "rounded-2xl border border-brand-primary/30 bg-white p-4 shadow-[0_0_30px_rgba(74,108,247,0.15)]", children: [_jsx("h3", { className: "text-sm font-semibold text-brand-primary", children: "\u672C\u8282\u9AD8\u5149" }), _jsx("ul", { className: "mt-2 space-y-2 text-sm", children: highlights.map((item) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-1 h-2 w-2 rounded-full bg-brand-primary" }), _jsx("span", { children: item })] }, item))) })] }));
}
