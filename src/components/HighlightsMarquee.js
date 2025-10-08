import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HighlightsMarquee({ highlights }) {
    if (!highlights.length) {
        return _jsx("div", { className: "text-white/60", children: "\u7B49\u5F85\u9AD8\u5149\u4EA7\u751F..." });
    }
    return (_jsxs("div", { className: "flex gap-6 overflow-hidden text-2xl font-semibold text-white", children: [_jsx("div", { className: "animate-[scroll_20s_linear_infinite] flex gap-6", children: highlights.map((item, idx) => (_jsxs("span", { className: "whitespace-nowrap", children: ["\u2728 ", item] }, `${item}-${idx}`))) }), _jsx("style", { children: '@keyframes scroll {0% {transform: translateX(0);} 100% {transform: translateX(-50%);}}' })] }));
}
