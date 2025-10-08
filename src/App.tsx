import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LayoutShell } from './components/LayoutShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

const Login = lazy(() => import('./pages/login'));
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
const TrainingIndex = lazy(() => import('./pages/training/index'));
const TrainingQualities = lazy(() => import('./pages/training/qualities'));
const TrainingGames = lazy(() => import('./pages/training/games'));
const TrainingPlans = lazy(() => import('./pages/training/plans'));

function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <LayoutShell />
          </ProtectedRoute>
        }
      >
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
        <Route path="training">
          <Route index element={<TrainingIndex />} />
          <Route path="qualities" element={<TrainingQualities />} />
          <Route path="games" element={<TrainingGames />} />
          <Route path="plans" element={<TrainingPlans />} />
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
