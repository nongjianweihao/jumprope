import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import { parseTemplates } from '../../utils/csv';
import { nanoid } from '../../utils/id';
export default function SettingsIndex() {
    const [json, setJson] = useState('');
    const [message, setMessage] = useState('');
    const handleImport = async () => {
        try {
            const templates = parseTemplates(json).map((template) => ({
                ...template,
                id: template.id ?? nanoid(),
                createdAt: template.createdAt ?? new Date().toISOString()
            }));
            await Promise.all(templates.map((template) => templatesRepo.upsert(template)));
            setMessage(`成功导入 ${templates.length} 个模板`);
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u7CFB\u7EDF\u8BBE\u7F6E & \u5BFC\u5165\u5BFC\u51FA" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u652F\u6301\u8BFE\u7A0B\u6A21\u677F JSON \u5BFC\u5165\u3001\u5BFC\u51FA\u5907\u4EFD\u4EE5\u53CA\u54C1\u724C\u914D\u7F6E\u3002" })] }), _jsxs("section", { className: "space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u5BFC\u5165\u8BFE\u7A0B\u6A21\u677F JSON" }), _jsx("textarea", { value: json, onChange: (event) => setJson(event.target.value), className: "h-40 w-full rounded-2xl border border-slate-200 p-3 text-xs", placeholder: "\u7C98\u8D34\u6A21\u677F\u6570\u7EC4 JSON\uFF0C\u652F\u6301\u65B0\u589E\u5B57\u6BB5 durationMinTotal" }), _jsx("button", { type: "button", onClick: handleImport, className: "rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white", children: "\u5BFC\u5165\u6A21\u677F" }), message && _jsx("div", { className: "text-xs text-brand-success", children: message })] })] }));
}
