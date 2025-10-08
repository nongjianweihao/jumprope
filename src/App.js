import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LayoutShell } from './components/LayoutShell';
const ClassesIndex = lazy(() => import('./pages/classes/index'));
const ClassNew = lazy(() => import('./pages/classes/new'));
const ClassDetail = lazy(() => import('./pages/classes/[id]'));
const SessionPanel = lazy(() => import('./pages/session/[id]'));
const StudentsIndex = lazy(() => import('./pages/students/index'));
const StudentsNew = lazy(() => import('./pages/students/new'));
const StudentProfile = lazy(() => import('./pages/students/[id]'));
const TemplatesIndex = lazy(() => import('./pages/templates/index'));
const TemplateNew = lazy(() => import('./pages/templates/new'));
const AssessmentsIndex = lazy(() => import('./pages/assessments/index'));
const FinanceIndex = lazy(() => import('./pages/finance/index'));
const ReportPreview = lazy(() => import('./pages/reports/[studentId]'));
const SettingsIndex = lazy(() => import('./pages/settings/index'));
const Wallboard = lazy(() => import('./pages/wallboard'));
function AppRoutes() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(LayoutShell, {}), children: [_jsx(Route, { index: true, element: _jsx(ClassesIndex, {}) }), _jsxs(Route, { path: "classes", children: [_jsx(Route, { index: true, element: _jsx(ClassesIndex, {}) }), _jsx(Route, { path: "new", element: _jsx(ClassNew, {}) }), _jsx(Route, { path: ":id", element: _jsx(ClassDetail, {}) })] }), _jsx(Route, { path: "session/:id", element: _jsx(SessionPanel, {}) }), _jsxs(Route, { path: "students", children: [_jsx(Route, { index: true, element: _jsx(StudentsIndex, {}) }), _jsx(Route, { path: "new", element: _jsx(StudentsNew, {}) }), _jsx(Route, { path: ":id", element: _jsx(StudentProfile, {}) })] }), _jsxs(Route, { path: "templates", children: [_jsx(Route, { index: true, element: _jsx(TemplatesIndex, {}) }), _jsx(Route, { path: "new", element: _jsx(TemplateNew, {}) })] }), _jsx(Route, { path: "assessments", element: _jsx(AssessmentsIndex, {}) }), _jsx(Route, { path: "finance", element: _jsx(FinanceIndex, {}) }), _jsx(Route, { path: "reports/:studentId", element: _jsx(ReportPreview, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsIndex, {}) }), _jsx(Route, { path: "wallboard", element: _jsx(Wallboard, {}) })] }) }));
}
export default function App() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-6 text-lg font-semibold", children: "\u52A0\u8F7D\u4E2D..." }), children: _jsx(AppRoutes, {}) }));
}
