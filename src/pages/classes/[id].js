import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classesRepo } from '../../store/repositories/classesRepo';
import { templatesRepo } from '../../store/repositories/templatesRepo';
export default function ClassDetail() {
    const params = useParams();
    const [entity, setEntity] = useState();
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        if (!params.id)
            return;
        classesRepo.get(params.id).then(setEntity);
        templatesRepo.list().then(setTemplates);
    }, [params.id]);
    if (!entity) {
        return _jsx("div", { className: "text-sm text-slate-500", children: "\u6B63\u5728\u52A0\u8F7D\u73ED\u7EA7\u4FE1\u606F..." });
    }
    const template = templates.find((t) => t.id === entity.templateId);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: entity.name }), _jsxs("p", { className: "text-sm text-slate-500", children: ["\u6559\u7EC3\uFF1A", entity.coachName] })] }), _jsx(Link, { to: `/session/${entity.id}`, className: "rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg", children: "\u5F00\u59CB\u672C\u8282\u8BFE" })] }), _jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u9ED8\u8BA4\u8BFE\u7A0B\u6A21\u677F" }), template ? (_jsxs("div", { className: "mt-2 space-y-2 text-sm", children: [_jsx("div", { className: "font-medium", children: template.name }), _jsx("div", { className: "text-xs text-slate-500", children: template.durationMinTotal ? `总时长 ${template.durationMinTotal} 分钟` : '未设置总时长' }), _jsx("ul", { className: "grid gap-2 md:grid-cols-2", children: template.blocks.map((block) => (_jsxs("li", { className: "rounded-xl border border-slate-100 bg-slate-50 p-3", children: [_jsx("div", { className: "text-sm font-semibold", children: block.title }), _jsxs("div", { className: "text-xs text-slate-500", children: [block.durationMin ?? 0, " min \u00B7 ", block.period] })] }, block.id))) })] })) : (_jsx("div", { className: "mt-2 text-sm text-slate-500", children: "\u5C1A\u672A\u7ED1\u5B9A\u6A21\u677F\uFF0C\u53EF\u5728\u6A21\u677F\u5E93\u521B\u5EFA\u540E\u7ED1\u5B9A\u3002" }))] })] }));
}
