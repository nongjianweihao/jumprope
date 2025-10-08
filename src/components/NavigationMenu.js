import { jsx as _jsx } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
const links = [
    { to: '/classes', label: '班级' },
    { to: '/students', label: '学员' },
    { to: '/templates', label: '模板库' },
    { to: '/session/demo', label: '上课面板' },
    { to: '/wallboard', label: '壁板模式' },
    { to: '/assessments', label: '测评' },
    { to: '/finance', label: '财务' },
    { to: '/settings', label: '设置' }
];
export function NavigationMenu() {
    return (_jsx("nav", { className: "flex flex-wrap gap-3 text-sm", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => `rounded-full px-3 py-1 transition-colors ${isActive ? 'bg-brand-primary text-white' : 'text-slate-600 hover:bg-slate-200'}`, children: link.label }, link.to))) }));
}
