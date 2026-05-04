import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursesPage from './pages/CoursesPage';
import HealthPage from './pages/HealthPage';
import SpecialNeedsPage from './pages/SpecialNeedsPage';
import KidToKidPage from './pages/KidToKidPage';
import SettingsPage from './pages/SettingsPage';

function RequireAuth({ children, role }: { children: JSX.Element; role?: string | string[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  }
  return children;
}

// Accessible to: professional, admin, kid_tutor, and students with likesToTeach
function RequireTeacher({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!user) return <Navigate to="/" replace />;
  if (
    user.role === 'professional' ||
    user.role === 'admin' ||
    user.role === 'kid_tutor' ||
    (user.role === 'student' && user.likesToTeach)
  ) {
    return children;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/special-needs" element={<SpecialNeedsPage />} />
      <Route path="/kid-to-kid" element={<KidToKidPage />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth role="student">
            <StudentDashboard />
          </RequireAuth>
        }
      />

      {/* Teaching routes — accessible to professional, kid_tutor, admin, students with likesToTeach */}
      <Route
        path="/teacher"
        element={
          <RequireTeacher>
            <TeacherDashboard />
          </RequireTeacher>
        }
      />
      <Route
        path="/teacher/courses"
        element={
          <RequireTeacher>
            <TeacherDashboard />
          </RequireTeacher>
        }
      />
      <Route path="/teacher/students" element={<Navigate to="/teacher" replace />} />
      <Route path="/teacher/analytics" element={<Navigate to="/teacher" replace />} />
      <Route path="/teacher/settings" element={<Navigate to="/teacher" replace />} />

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/courses" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/health" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/special-needs" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/kid-to-kid" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/analytics" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/pending" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />

      <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
