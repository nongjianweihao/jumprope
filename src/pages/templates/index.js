import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { templatesRepo } from '../../store/repositories/templatesRepo';
export default function TemplatesIndex() {
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        templatesRepo.list().then(setTemplates);
    }, []);
    const avgDuration = useMemo(() => {
        if (!templates.length)
            return 0;
        return (templates.reduce((sum, template) => sum + (template.durationMinTotal ?? 0), 0) /
            templates.length);
    }, [templates]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u8BFE\u7A0B\u6A21\u677F\u5E93" }), _jsxs("p", { className: "text-sm text-slate-500", children: ["\u5E73\u5747\u603B\u65F6\u957F\uFF1A", avgDuration.toFixed(1), " \u5206\u949F"] })] }), _jsx(Link, { to: "/templates/new", className: "rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white", children: "\u65B0\u5EFA\u6A21\u677F" })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [templates.map((template) => (_jsxs("article", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: template.name }), _jsxs("p", { className: "text-xs text-slate-500", children: ["\u9636\u6BB5\uFF1A", template.period] })] }), _jsxs("div", { className: "rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary", children: [template.durationMinTotal ?? 0, " min"] })] }), _jsx("ul", { className: "mt-4 space-y-2 text-sm", children: template.blocks.map((block) => (_jsxs("li", { className: "rounded-xl bg-slate-50 px-3 py-2", children: [_jsx("div", { className: "font-medium", children: block.title }), _jsxs("div", { className: "text-xs text-slate-500", children: [block.durationMin ?? 0, " \u5206\u949F \u00B7 ", block.period] })] }, block.id))) })] }, template.id))), !templates.length && (_jsx("div", { className: "rounded-3xl border border-dashed border-slate-300 p-6 text-slate-500", children: "\u6682\u65E0\u6A21\u677F\uFF0C\u53EF\u70B9\u51FB\u53F3\u4E0A\u89D2\u521B\u5EFA\u6216\u5BFC\u5165 JSON\u3002" }))] })] }));
}
