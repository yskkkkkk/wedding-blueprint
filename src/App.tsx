import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvitationPage from '@/pages/InvitationPage';

import { Suspense, lazy } from 'react';

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminDetail = lazy(() => import('@/pages/admin/AdminDetail'));
const InvitationBuilder = lazy(() => import('@/pages/admin/InvitationBuilder'));

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Must be before the slug route */}
        <Route 
          path="/admin" 
          element={<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}><AdminLogin /></Suspense>} 
        />
        <Route 
          path="/admin/dashboard" 
          element={<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}><AdminDashboard /></Suspense>} 
        />
        <Route 
          path="/admin/dashboard/:slug" 
          element={<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}><AdminDetail /></Suspense>} 
        />
        <Route 
          path="/admin/builder" 
          element={<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}><InvitationBuilder /></Suspense>} 
        />

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
