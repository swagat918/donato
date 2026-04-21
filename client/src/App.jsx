import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StreamerListPage from './pages/StreamerListPage';
import StreamerProfilePage from './pages/StreamerProfilePage';
import UserDashboardPage from './pages/UserDashboardPage';
import StreamerDashboardPage from './pages/StreamerDashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(247,165,27,0.20),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(43,185,167,0.18),transparent_28%),linear-gradient(180deg,#f6f3ed_0%,#f2efe8_100%)]" />
      <NavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/streamers" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/streamers" element={<StreamerListPage />} />
          <Route path="/streamers/:id" element={<StreamerProfilePage />} />
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['user', 'streamer']}>
                  <UserDashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/streamer"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['streamer']}>
                  <StreamerDashboardPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
