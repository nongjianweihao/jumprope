import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { nanoid } from '../../utils/id';
import { classesRepo } from '../../store/repositories/classesRepo';
import { Link } from 'react-router-dom';
export default function ClassesIndex() {
    const [classes, setClasses] = useState([]);
    useEffect(() => {
        classesRepo.list().then(setClasses);
    }, []);
    const handleCreate = async () => {
        const entity = {
            id: nanoid(),
            name: `体验班 ${classes.length + 1}`,
            coachName: '勇士教练',
            studentIds: []
        };
        await classesRepo.upsert(entity);
        setClasses(await classesRepo.list());
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u73ED\u7EA7\u7BA1\u7406" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u65B0\u5EFA\u73ED\u7EA7 \u2192 \u7ED1\u5B9A\u5B66\u5458 \u2192 \u9009\u62E9\u6A21\u677F \u2192 \u5F00\u542F\u4E0A\u8BFE" })] }), _jsx("button", { type: "button", onClick: handleCreate, className: "rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white", children: "\u65B0\u5EFA\u73ED\u7EA7" })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [classes.map((item) => (_jsxs(Link, { to: `/classes/${item.id}`, className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg", children: [_jsx("div", { className: "text-lg font-semibold", children: item.name }), _jsxs("div", { className: "text-xs text-slate-500", children: ["\u6559\u7EC3\uFF1A", item.coachName] }), _jsxs("div", { className: "mt-2 text-sm text-slate-600", children: ["\u5B66\u5458\u6570\uFF1A", item.studentIds.length] })] }, item.id))), !classes.length && (_jsx("div", { className: "rounded-2xl border border-dashed border-slate-300 p-6 text-slate-500", children: "\u6682\u65E0\u73ED\u7EA7\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u300C\u65B0\u5EFA\u73ED\u7EA7\u300D\u5F00\u59CB\u3002" }))] })] }));
}
