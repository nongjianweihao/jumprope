import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { testsRepo } from '../../store/repositories/testsRepo';
import { nanoid } from '../../utils/id';
const QUALITIES = ['speed', 'power', 'endurance', 'coordination', 'agility', 'balance', 'flexibility', 'core', 'accuracy'];
export default function AssessmentsIndex() {
    const [quarter, setQuarter] = useState('2025Q4');
    const [studentId, setStudentId] = useState('demo');
    const handleCreate = async () => {
        const result = {
            id: nanoid(),
            studentId,
            quarter,
            date: new Date().toISOString(),
            items: QUALITIES.map((quality, idx) => ({ itemId: `${quality}-${idx}`, value: 60 + idx * 2 })),
            radar: QUALITIES.reduce((acc, quality, idx) => ({ ...acc, [quality]: 60 + idx * 4 }), {})
        };
        await testsRepo.upsert(result);
        alert('季度测评已生成并同步到档案');
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u5B63\u5EA6\u6D4B\u8BC4 & \u6BB5\u4F4D\u8003\u6838" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u5F55\u5165\u4F53\u80FD\u6570\u636E\u540E\u81EA\u52A8\u751F\u6210\u96F7\u8FBE\u56FE\uFF0C\u6EE1\u8DB3\u901F\u5EA6\u9608\u503C\u81EA\u52A8\u6BB5\u4F4D\u5347\u7EA7\u3002" })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("label", { className: "text-sm font-medium", children: ["\u6D4B\u8BC4\u5B63\u5EA6", _jsx("input", { value: quarter, onChange: (event) => setQuarter(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] }), _jsxs("label", { className: "text-sm font-medium", children: ["\u5B66\u5458 ID", _jsx("input", { value: studentId, onChange: (event) => setStudentId(event.target.value), className: "mt-1 w-full rounded-xl border border-slate-200 p-3" })] })] }), _jsx("button", { type: "button", onClick: handleCreate, className: "rounded-full bg-brand-primary px-6 py-2 text-sm font-semibold text-white", children: "\u751F\u6210\u5B63\u5EA6\u6D4B\u8BC4" })] }));
}
