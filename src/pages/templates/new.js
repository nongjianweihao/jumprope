import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { templatesRepo } from '../../store/repositories/templatesRepo';
const BLOCK_PRESETS = [
    { title: '热身激活', period: 'PREP', duration: 10 },
    { title: '专项技能', period: 'SPEC', duration: 20 },
    { title: '体能素质', period: 'SPEC', duration: 15 },
    { title: '花样进阶', period: 'SPEC', duration: 15 },
    { title: '游戏挑战', period: 'COMP', duration: 10 },
    { title: '放松反馈', period: 'PREP', duration: 5 }
];
export default function TemplateNew() {
    const navigate = useNavigate();
    const [name, setName] = useState('基础准备课 A');
    const [period, setPeriod] = useState('PREP');
    const [durationMinTotal, setDurationMinTotal] = useState(75);
    const [blocks, setBlocks] = useState(BLOCK_PRESETS.map((preset) => ({
        id: nanoid(),
        title: preset.title,
        period: preset.period,
        durationMin: preset.duration,
        notes: `${preset.title} - 默认安排`
    })));
    const handleSubmit = async (event) => {
        event.preventDefault();
        const template = {
            id: nanoid(),
            name,
            period,
            durationMinTotal,
            blocks,
            createdAt: new Date().toISOString()
        };
        await templatesRepo.upsert(template);
        navigate('/templates');
    };
    const totalMinutes = blocks.reduce((sum, block) => sum + (block.durationMin ?? 0), 0);
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold", children: "\u65B0\u5EFA\u8BFE\u7A0B\u6A21\u677F" }), _jsxs("div", { className: "text-sm text-slate-500", children: ["\u5DF2\u6392\u8BFE\u65F6\u957F ", totalMinutes, " / \u76EE\u6807 ", durationMinTotal, " \u5206\u949F"] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "text-sm font-medium", children: ["\u6A21\u677F\u540D\u79F0", _jsx("input", { value: name, onChange: (event) => setName(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsxs("label", { className: "text-sm font-medium", children: ["\u9002\u7528\u9636\u6BB5", _jsxs("select", { value: period, onChange: (event) => setPeriod(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3", children: [_jsx("option", { value: "PREP", children: "PREP \u00B7 \u57FA\u7840" }), _jsx("option", { value: "SPEC", children: "SPEC \u00B7 \u63D0\u5347" }), _jsx("option", { value: "COMP", children: "COMP \u00B7 \u7ADE\u8D5B" })] })] }), _jsxs("label", { className: "text-sm font-medium", children: ["\u603B\u65F6\u957F (60\u201390)", _jsx("input", { type: "number", min: 60, max: 90, value: durationMinTotal, onChange: (event) => setDurationMinTotal(Number(event.target.value)), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u533A\u5757\u8BBE\u8BA1" }), blocks.map((block, idx) => (_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("span", { className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary", children: idx + 1 }), _jsx("input", { value: block.title, onChange: (event) => setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, title: event.target.value } : item))), className: "flex-1 rounded-xl border border-slate-200 p-2 text-sm" }), _jsx("input", { type: "number", min: 5, max: 40, value: block.durationMin ?? 0, onChange: (event) => setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, durationMin: Number(event.target.value) } : item))), className: "w-24 rounded-xl border border-slate-200 p-2 text-sm" })] }), _jsx("textarea", { value: block.notes ?? '', onChange: (event) => setBlocks((prev) => prev.map((item) => (item.id === block.id ? { ...item, notes: event.target.value } : item))), className: "mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm", placeholder: "\u5907\u6CE8\uFF1A\u76EE\u6807\u7D20\u8D28\u3001\u82B1\u6837\u5EFA\u8BAE\u3001\u79EF\u5206\u7B56\u7565\u7B49" })] }, block.id)))] }), _jsx("button", { type: "submit", className: "rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white shadow-lg", children: "\u4FDD\u5B58\u6A21\u677F" })] }));
}
