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
  return (
    <Routes>
      <Route element={<LayoutShell />}>
        <Route index element={<ClassesIndex />} />
        <Route path="classes">
          <Route index element={<ClassesIndex />} />
          <Route path="new" element={<ClassNew />} />
          <Route path=":id" element={<ClassDetail />} />
        </Route>
        <Route path="session/:id" element={<SessionPanel />} />
        <Route path="students">
          <Route index element={<StudentsIndex />} />
          <Route path="new" element={<StudentsNew />} />
          <Route path=":id" element={<StudentProfile />} />
        </Route>
        <Route path="templates">
          <Route index element={<TemplatesIndex />} />
          <Route path="new" element={<TemplateNew />} />
        </Route>
        <Route path="assessments" element={<AssessmentsIndex />} />
        <Route path="finance" element={<FinanceIndex />} />
        <Route path="reports/:studentId" element={<ReportPreview />} />
        <Route path="settings" element={<SettingsIndex />} />
        <Route path="wallboard" element={<Wallboard />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 text-lg font-semibold">加载中...</div>}>
      <AppRoutes />
    </Suspense>
  );
}
