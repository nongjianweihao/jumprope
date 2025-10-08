import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';
export function LayoutShell() {
    return (_jsxs("div", { className: "min-h-screen bg-slate-100 text-slate-900", children: [_jsx("header", { className: "border-b border-slate-200 bg-white/80 backdrop-blur", children: _jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold tracking-wide text-brand-primary", children: "\u52C7\u58EB\u8DF3\u7EF3 \u00B7 \u6559\u5B66\u4E2D\u53F0" }), _jsx("p", { className: "text-xs text-slate-500", children: "PWA \u79BB\u7EBF \u00B7 Dexie \u672C\u5730\u5316 \u00B7 \u6E38\u620F\u5316\u6210\u957F\u6863\u6848" })] }), _jsx(NavigationMenu, {})] }) }), _jsx("main", { className: "mx-auto max-w-6xl px-6 py-6", children: _jsx(Outlet, {}) })] }));
}
