import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvitationPage from '@/pages/InvitationPage';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminDetail from '@/pages/admin/AdminDetail';
import InvitationBuilder from '@/pages/admin/InvitationBuilder';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Must be before the slug route */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/:slug" element={<AdminDetail />} />
        <Route path="/admin/builder" element={<InvitationBuilder />} />

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
