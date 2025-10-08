import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from '../../utils/id';
import { studentsRepo } from '../../store/repositories/studentsRepo';
export default function StudentsNew() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const id = nanoid();
        await studentsRepo.upsert({ id, name, guardian: { name: '家长', phone } });
        navigate(`/students/${id}`);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "mx-auto max-w-xl space-y-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "\u65B0\u5EFA\u5B66\u5458\u6863\u6848" }), _jsxs("label", { className: "block text-sm font-medium", children: ["\u59D3\u540D", _jsx("input", { value: name, onChange: (event) => setName(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsxs("label", { className: "block text-sm font-medium", children: ["\u5BB6\u957F\u7535\u8BDD", _jsx("input", { value: phone, onChange: (event) => setPhone(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsx("button", { type: "submit", className: "rounded-full bg-brand-primary px-6 py-2 text-white", children: "\u521B\u5EFA\u6863\u6848" })] }));
}
