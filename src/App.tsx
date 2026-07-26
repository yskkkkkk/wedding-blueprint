import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvitationPage from '@/pages/InvitationPage';

import { Suspense, lazy } from 'react';

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminDetail = lazy(() => import('@/pages/admin/AdminDetail'));
const InvitationBuilder = lazy(() => import('@/pages/admin/InvitationBuilder'));

const AdminSuspenseLayout = () => (
  <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}>
    <Outlet />
  </Suspense>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Must be before the slug route */}
        <Route element={<AdminSuspenseLayout />}>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/:slug" element={<AdminDetail />} />
          <Route path="/admin/builder" element={<InvitationBuilder />} />
        </Route>

        {/* Guest View Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/demo-wedding" replace />} />
          <Route path="/:invitationSlug" element={<InvitationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
