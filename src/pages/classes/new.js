import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { classesRepo } from '../../store/repositories/classesRepo';
export default function ClassNew() {
    const navigate = useNavigate();
    const [name, setName] = useState('春季基础班');
    const [coachName, setCoachName] = useState('勇士教练');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const id = nanoid();
        await classesRepo.upsert({ id, name, coachName, studentIds: [] });
        navigate(`/classes/${id}`);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "mx-auto max-w-xl space-y-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "\u65B0\u5EFA\u73ED\u7EA7" }), _jsxs("label", { className: "block text-sm font-medium", children: ["\u73ED\u7EA7\u540D\u79F0", _jsx("input", { value: name, onChange: (event) => setName(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsxs("label", { className: "block text-sm font-medium", children: ["\u6559\u7EC3\u59D3\u540D", _jsx("input", { value: coachName, onChange: (event) => setCoachName(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsx("button", { type: "submit", className: "rounded-full bg-brand-primary px-6 py-2 text-white", children: "\u521B\u5EFA" })] }));
}
