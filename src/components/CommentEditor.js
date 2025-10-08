import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const defaultTags = ['专注', '积极', '配合', '节奏', '技术'];
export function CommentEditor({ onSubmit }) {
    const [comment, setComment] = useState('');
    const [selected, setSelected] = useState([]);
    const toggle = (tag) => {
        setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };
    return (_jsxs("div", { className: "space-y-3 rounded-2xl border border-slate-200 bg-white p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u8BFE\u5802\u70B9\u8BC4" }), _jsx("div", { className: "flex flex-wrap gap-2 text-xs", children: defaultTags.map((tag) => (_jsxs("button", { type: "button", onClick: () => toggle(tag), className: `rounded-full border px-3 py-1 ${selected.includes(tag) ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:border-brand-primary/40'}`, children: ["#", tag] }, tag))) }), _jsx("textarea", { value: comment, onChange: (event) => setComment(event.target.value), className: "h-24 w-full rounded-xl border border-slate-200 p-3 text-sm", placeholder: "\u8BB0\u5F55\u672C\u8282\u8BFE\u8868\u73B0\u4EAE\u70B9/\u5EFA\u8BAE" }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "button", onClick: () => onSubmit(comment, selected), className: "rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white", children: "\u4FDD\u5B58\u70B9\u8BC4" }) })] }));
}
